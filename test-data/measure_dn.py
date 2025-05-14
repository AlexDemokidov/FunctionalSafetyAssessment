import numpy as np
from scipy.optimize import minimize
from scipy.integrate import quad

def measure(data):
    def normalize_values(z_data, mins, maxs, direct_flags):
        arr = np.array(z_data, dtype=float)
        norms = []
        for i in range(arr.shape[1]):
            min_val = mins[i]
            max_val = maxs[i]
            direct = direct_flags[i]
            if direct:
                norm = (arr[:, i] - min_val) / (max_val - min_val)
            else:
                norm = 1 - (arr[:, i] - min_val) / (max_val - min_val)
            norms.append(norm)
        return np.stack(norms, axis=1)

    def h_dn(t, mu, v, gamma, z):
        if t <= 0:
            return 0
        hz = np.exp(np.dot(gamma, z))
        coef = np.sqrt(mu) / (v * t * np.sqrt(2 * np.pi * t))
        exponent = -((t - mu) ** 2) / (2 * v ** 2 * mu * t)
        return coef * np.exp(exponent) * hz

    def R_dn_approx(t, mu, v, gamma, z):
        ts = np.linspace(1e-3, t, 100)
        hs = np.array([h_dn(tau, mu, v, gamma, z) for tau in ts])
        return np.exp(-np.trapz(hs, ts))

    def f_dn(t, mu, v, gamma, z):
        return h_dn(t, mu, v, gamma, z) * R_dn_approx(t, mu, v, gamma, z)

    def log_likelihood(params, t1, z1, t2, z2):
        mu1, v1, mu2, v2, lam, g1, g2, g3 = params
        gamma = np.array([g1, g2, g3])
        eps = 1e-12
        L1 = np.log([lam * f_dn(t, mu1, v1, gamma, z) + eps for t, z in zip(t1, z1)])
        L2 = np.log([(1 - lam) * f_dn(t, mu2, v2, gamma, z) + eps for t, z in zip(t2, z2)])
        return -np.sum(L1) - np.sum(L2)

    def f_dn_mixed(t, mu1, v1, mu2, v2, lam, gamma, z):
        f1 = f_dn(t, mu1, v1, gamma, z)
        f2 = f_dn(t, mu2, v2, gamma, z)
        return lam * f1 + (1 - lam) * f2

    def calculate_sil(pfh):
        if pfh > 1e-5:
            return 0
        elif pfh > 1e-6:
            return 1
        elif pfh > 1e-7:
            return 2
        elif pfh > 1e-8:
            return 3
        else:
            return 4

    # === Распаковка данных ===
    mins = [float(data['parameter1Min']), float(data['parameter2Min']), float(data['parameter3Min'])]
    maxs = [float(data['parameter1Max']), float(data['parameter2Max']), float(data['parameter3Max'])]
    direct_flags = [
        data['parameter1DirectlyProportional'].lower() == 'true',
        data['parameter2DirectlyProportional'].lower() == 'true',
        data['parameter3DirectlyProportional'].lower() == 'true'
    ]

    modes = {}
    for entry in data['project']:
        mode = entry['name']
        t = float(entry['time'])
        z_vals = (float(entry['parameter1']), float(entry['parameter2']), float(entry['parameter3']))
        modes.setdefault(mode, {'times': [], 'values': []})
        modes[mode]['times'].append(t)
        modes[mode]['values'].append(z_vals)

    mode_names = list(modes.keys())
    t1 = np.array(modes[mode_names[0]]['times'], dtype=float)
    t2 = np.array(modes[mode_names[1]]['times'], dtype=float)
    z1 = normalize_values(modes[mode_names[0]]['values'], mins, maxs, direct_flags)
    z2 = normalize_values(modes[mode_names[1]]['values'], mins, maxs, direct_flags)

    rng = np.random.default_rng(seed=42)
    x0 = [
        np.median(t1), 0.3,
        np.median(t2), 0.3,
        0.5,
        rng.uniform(-2, 2), rng.uniform(-2, 2), rng.uniform(-2, 2)
    ]

    bounds = [
        (10, 3000), (0.01, 2),
        (10, 3000), (0.01, 2),
        (0.01, 0.99),
        (-5, 5), (-5, 5), (-5, 5)
    ]

    res = minimize(log_likelihood, x0, args=(t1, z1, t2, z2), bounds=bounds, method='Nelder-Mead', options={'maxiter': 10000})
    mu1, v1, mu2, v2, lam, g1, g2, g3 = res.x
    gamma = np.array([g1, g2, g3])
    z_avg = (np.mean(z1, axis=0) + np.mean(z2, axis=0)) / 2

    ts = np.linspace(1, 3500, 500)
    ft = [t * f_dn_mixed(t, mu1, v1, mu2, v2, lam, gamma, z_avg) for t in ts]
    mttf = np.trapz(ft, ts)
    pfh = 1 / mttf
    sil = calculate_sil(pfh)

    # return {
    #     "mu1": f"{mu1:.2f}", "v1": f"{v1:.2f}",
    #     "mu2": f"{mu2:.2f}", "v2": f"{v2:.2f}",
    #     "lambda1": f"{lam:.2f}",
    #     "gamma1": f"{g1:.2f}", "gamma2": f"{g2:.2f}", "gamma3": f"{g3:.2f}",
    #     "mttf": f"{mttf:.2f}",
    #     "pfh": f"{pfh:.2e}",
    #     "sil": f"{sil}"
    # }

    return {
        "beta1": f"{mu1:.2f}", "eta1": f"{v1:.2f}",
        "beta2": f"{mu2:.2f}", "eta2": f"{v2:.2f}",
        "lambda1": f"{lam:.2f}",
        "gamma1": f"{g1:.2f}", "gamma2": f"{g2:.2f}", "gamma3": f"{g3:.2f}",
        "mttf": f"{mttf:.2f}", "pfh": f"{pfh:.2e}", "sil": f"{sil}"
    }
