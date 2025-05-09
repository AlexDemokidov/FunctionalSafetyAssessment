import numpy as np
from scipy.optimize import minimize
from scipy.integrate import quad

def measure(project):
    data = []
    for point in project["project"]:
        data.append({
            "mode": point["name"],
            "t": max(float(point["time"]), 1e-6),
            "p1": float(point["parameter1"]),
            "p2": float(point["parameter2"]),
            "p3": float(point["parameter3"])
        })

    def normalize(p1, p2, p3):
        def norm(x, x_min, x_max, direct):
            scale = (x - x_min) / (x_max - x_min)
            return scale if direct else 1 - scale
        z1 = norm(p1, float(project["parameter1Min"]), float(project["parameter1Max"]),
                  project["parameter1DirectlyProportional"].lower() == "true")
        z2 = norm(p2, float(project["parameter2Min"]), float(project["parameter2Max"]),
                  project["parameter2DirectlyProportional"].lower() == "true")
        z3 = norm(p3, float(project["parameter3Min"]), float(project["parameter3Max"]),
                  project["parameter3DirectlyProportional"].lower() == "true")
        return np.array([z1, z2, z3])

    def safe_log(x):
        return np.log(max(x, 1e-100))

    def negative_log_likelihood(params):
        beta1, eta1, beta2, eta2, gamma1, gamma2, gamma3, logit_lambda = params
        gamma = np.array([gamma1, gamma2, gamma3])
        lambda1 = 1 / (1 + np.exp(-logit_lambda))
        lambda2 = 1 - lambda1
        total = 0.0
        for point in data:
            t = point['t']
            z = normalize(point['p1'], point['p2'], point['p3'])
            beta, eta, lam = (beta1, eta1, lambda1) if point['mode'] == 'Mode 1' else (beta2, eta2, lambda2)
            log_h = safe_log(beta) - safe_log(eta) + (beta - 1) * (safe_log(t) - safe_log(eta)) + np.dot(gamma, z)
            log_S = -((t / eta) ** beta) * np.exp(np.dot(gamma, z))
            total += log_h + log_S + safe_log(lam)
        return -total

    def weibull_pdf(t, beta, eta):
        return (beta / eta) * (t / eta) ** (beta - 1) * np.exp(-(t / eta) ** beta)

    def mixed_pdf(t, beta1, eta1, beta2, eta2, lambda1, gamma, z_avg):
        exp_gz = np.exp(np.dot(gamma, z_avg))
        f1 = (beta1 / eta1) * (t / eta1)**(beta1 - 1) * exp_gz * np.exp(-((t / eta1)**beta1) * exp_gz)
        f2 = (beta2 / eta2) * (t / eta2)**(beta2 - 1) * exp_gz * np.exp(-((t / eta2)**beta2) * exp_gz)
        return lambda1 * f1 + (1 - lambda1) * f2

    def calculate_sil(pfh):
        if pfh < 1e-8: return 4
        elif pfh < 1e-7: return 3
        elif pfh < 1e-6: return 2
        elif pfh < 1e-5: return 1
        return 0

    # Автоматическое определение eta1 и eta2
    times_mode1 = [d["t"] for d in data if d["mode"] == "Mode 1"]
    times_mode2 = [d["t"] for d in data if d["mode"] == "Mode 2"]
    eta1_init = np.median(times_mode1) if times_mode1 else 1000
    eta2_init = np.median(times_mode2) if times_mode2 else 1000

    # Начальные параметры
    init_params = np.array([
        1.5, eta1_init,       # beta1, eta1
        2.0, eta2_init,       # beta2, eta2
        0.0, 0.0, 0.0,        # gamma1, gamma2, gamma3
        0.0                   # logit_lambda → λ = 0.5
    ])

    # Границы параметров
    bounds = [
        (0.1, 5.0), (300, 3000),
        (0.5, 5.0), (300, 3000),
        (-10, 10), (-10, 10), (-10, 10),
        (-2.2, 2.2)
    ]

    # Оптимизация
    result = minimize(
        negative_log_likelihood,
        init_params,
        method='L-BFGS-B',
        bounds=bounds,
        options={'ftol': 1e-10, 'gtol': 1e-8, 'maxiter': 5000}
    )

    # Извлечь параметры
    beta1, eta1, beta2, eta2, gamma1, gamma2, gamma3, logit_lambda = result.x
    lambda1 = 1 / (1 + np.exp(-logit_lambda))
    gamma = np.array([gamma1, gamma2, gamma3])
    z_avg = np.mean([normalize(d["p1"], d["p2"], d["p3"]) for d in data], axis=0)

    # Вычислить MTTF, PFH и SIL
    mttf, _ = quad(lambda t: t * mixed_pdf(t, beta1, eta1, beta2, eta2, lambda1, gamma, z_avg), 0, np.inf)
    pfh = 1 / mttf
    sil = calculate_sil(pfh)

    return {
        "beta1": f"{beta1:.2f}", "eta1": f"{eta1:.2f}",
        "beta2": f"{beta2:.2f}", "eta2": f"{eta2:.2f}",
        "lambda1": f"{lambda1:.2f}",
        "gamma1": f"{gamma1:.2f}", "gamma2": f"{gamma2:.2f}", "gamma3": f"{gamma3:.2f}",
        "mttf": f"{mttf:.2f}", "pfh": f"{pfh:.2e}", "sil": f"{sil}"
    }
