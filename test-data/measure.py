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


    def log_likelihood(params, t1, z1, t2, z2):
        β1, η1, β2, η2, λ, γ1, γ2, γ3 = params
        γ = np.array([γ1, γ2, γ3])

        def fg(t, z, β, η):
            hz = np.exp(γ @ z)
            h = (β / η) * (t / η) ** (β - 1) * hz
            R = np.exp(- (t / η) ** β * hz)
            return h * R

        eps = 1e-12
        f1 = np.array([fg(t, z, β1, η1) for t, z in zip(t1, z1)])
        f2 = np.array([fg(t, z, β2, η2) for t, z in zip(t2, z2)])

        L1 = np.log(λ * f1 + eps)
        L2 = np.log((1 - λ) * f2 + eps)
        return -np.sum(L1) - np.sum(L2)


    def mixed_pdf(t, β1, η1, β2, η2, λ, γ, z):
        hz = np.exp(γ @ z)
        h1 = (β1 / η1) * (t / η1) ** (β1 - 1) * hz
        h2 = (β2 / η2) * (t / η2) ** (β2 - 1) * hz
        R1 = np.exp(- (t / η1) ** β1 * hz)
        R2 = np.exp(- (t / η2) ** β2 * hz)
        return λ * h1 * R1 + (1 - λ) * h2 * R2


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


    # === Основной расчёт ===
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
        rng.uniform(0.5, 3),
        np.median(t1),
        rng.uniform(0.5, 3),
        np.median(t2),
        rng.uniform(0.3, 0.8),
        rng.uniform(-2, 2),
        rng.uniform(-2, 2),
        rng.uniform(-2, 2)
    ]

    bounds = [
        (0.1, 5), (10, 3000),
        (0.1, 5), (10, 3000),
        (0.01, 0.99),
        (-10, 10), (-10, 10), (-10, 10)
    ]

    res = minimize(log_likelihood, x0, args=(t1, z1, t2, z2), method='Nelder-Mead', bounds=bounds, options={'maxiter': 10000})

    β1, η1, β2, η2, λ, γ1, γ2, γ3 = res.x
    γ = np.array([γ1, γ2, γ3])
    z_avg = (np.mean(z1, axis=0) + np.mean(z2, axis=0)) / 2
    mttf, _ = quad(lambda t: t * mixed_pdf(t, β1, η1, β2, η2, λ, γ, z_avg), 0, np.inf)
    pfh = 1 / mttf
    sil = calculate_sil(pfh)

    return {
        "beta1": f"{β1:.2f}", "eta1": f"{η1:.2f}",
        "beta2": f"{β2:.2f}", "eta2": f"{η2:.2f}",
        "lambda1": f"{λ:.2f}",
        "gamma1": f"{γ1:.2f}", "gamma2": f"{γ2:.2f}", "gamma3": f"{γ3:.2f}",
        "mttf": f"{mttf:.2f}", "pfh": f"{pfh:.2e}", "sil": f"{sil}"
    }
