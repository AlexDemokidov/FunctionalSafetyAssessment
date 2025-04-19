from math import exp
import numpy as np
from scipy.optimize import minimize
from scipy.integrate import quad

def measure(project):

    # model = project
    # Подготовка данных
    data = []
    for point in project["project"]:
        data.append({
            "mode": point["name"],
            "t": float(point["time"]),
            "p1": float(point["parameter1"]),
            "p2": float(point["parameter2"]),
            "p3": float(point["parameter3"])
        })

    # Функция нормализации с исправленным синтаксисом
    def normalize(p1, p2, p3):
        # Получаем границы и диапазоны для каждого параметра
        p1_min, p1_max = float(project["parameter1Min"]), float(project["parameter1Max"])
        p2_min, p2_max = float(project["parameter2Min"]), float(project["parameter2Max"])
        p3_min, p3_max = float(project["parameter3Min"]), float(project["parameter3Max"])

        p1_range = p1_max - p1_min
        p2_range = p2_max - p2_min
        p3_range = p3_max - p3_min

        # Нормализация параметра 1 (давление)
        clipped_p1 = np.clip(p1, p1_min, p1_max)
        if project["parameter1DirectlyProportional"].lower() == "false":
            z1 = 1 - (clipped_p1 - p1_min) / p1_range
        else:
            z1 = (clipped_p1 - p1_min) / p1_range

        # Нормализация параметра 2 (вибрация)
        clipped_p2 = np.clip(p2, p2_min, p2_max)
        if project["parameter2DirectlyProportional"].lower() == "false":
            z2 = 1 - (clipped_p2 - p2_min) / p2_range
        else:
            z2 = (clipped_p2 - p2_min) / p2_range

        # Нормализация параметра 3 (температура)
        clipped_p3 = np.clip(p3, p3_min, p3_max)
        if project["parameter3DirectlyProportional"].lower() == "false":
            z3 = 1 - (clipped_p3 - p3_min) / p3_range
        else:
            z3 = (clipped_p3 - p3_min) / p3_range

        return np.array([z1, z2, z3])

    # Безопасное вычисление логарифма
    def safe_log(x):
        return np.log(max(x, 1e-100))

    # Функция правдоподобия
    def negative_log_likelihood(params):
        beta1, eta1, beta2, eta2, gamma1, gamma2, gamma3, logit_lambda = params
        gamma = np.array([gamma1, gamma2, gamma3])
        lambda1 = 1 / (1 + np.exp(-logit_lambda))
        lambda2 = 1 - lambda1

        total = 0.0
        for point in data:
            t = point['t']
            z = normalize(point['p1'], point['p2'], point['p3'])

            if point['mode'] == 'Mode 1':
                beta, eta, lam = beta1, eta1, lambda1
            else:
                beta, eta, lam = beta2, eta2, lambda2

            # Вычисление функции риска и выживаемости
            log_h = (np.log(beta) - np.log(eta) + 
                    (beta - 1) * (np.log(t) - np.log(eta)) + 
                    np.dot(gamma, z))

            log_S = -((t / eta) ** beta) * np.exp(np.dot(gamma, z))

            total += log_h + log_S + safe_log(lam)

        return -total

    # Начальные параметры и ограничения
    init_params = np.array([1.13, 622.31, 2.61, 887.40, 
                           1.44, 2.80, -3.26, np.log(0.64/0.36)])

    bounds = [
        (0.5, 2.0), (300, 1000),    # beta1, eta1
        (1.5, 4.0), (500, 1500),    # beta2, eta2
        (0.5, 3.0), (1.5, 4.0), (-5.0, -1.0),  # gamma1, gamma2, gamma3
        (None, None)                # logit_lambda
    ]

    # Оптимизация
    result = minimize(
        negative_log_likelihood,
        init_params,
        method='trust-constr',
        bounds=bounds,
        options={'xtol': 1e-6, 'gtol': 1e-6, 'maxiter': 1000, 'verbose': 1}
    )

    def weibull_pdf(t, beta, eta):
        return (beta / eta) * (t / eta)**(beta - 1) * np.exp(-(t / eta)**beta)

    def mixed_pdf(t, beta1, eta1, beta2, eta2, lambda1):
        pdf1 = weibull_pdf(t, beta1, eta1)
        pdf2 = weibull_pdf(t, beta2, eta2)
        return lambda1 * pdf1 + (1 - lambda1) * pdf2

    def calculate_mttf(beta1, eta1, beta2, eta2, lambda1):
        # MTBF это интеграл смешанной функции плотности вероятности от 0 до бесконечности
        result, _ = quad(lambda t: t * mixed_pdf(t, beta1, eta1, beta2, eta2, lambda1), 0, np.inf)
        return result
    
    def calculate_sil(pfh):
        """Определение SIL по значению PFH"""
        if pfh < 1e-8:
            return 4
        elif 1e-8 <= pfh < 1e-7:
            return 3
        elif 1e-7 <= pfh < 1e-6:
            return 2
        elif 1e-6 <= pfh < 1e-5:
            return 1
        else:
            return 0  # Не соответствует SIL

    beta1, eta1, beta2, eta2, gamma1, gamma2, gamma3, logit_lambda = result.x
    lambda1 = 1 / (1 + np.exp(-logit_lambda))
    lambda2 = 1 - lambda1
    print("\nРезультаты оптимизации:")
    print("-----------------------")
    print(f"Mode 1: β = {beta1:.2f}, η = {eta1:.2f}")
    print(f"Mode 2: β = {beta2:.2f}, η = {eta2:.2f}")
    print(f"\nКоэффициенты влияния:")
    print(f"γ1 (Давление) = {gamma1:.2f}")
    print(f"γ2 (Вибрация) = {gamma2:.2f}")
    print(f"γ3 (Температура) = {gamma3:.2f}")
    print(f"\nДоли смешивания:")
    print(f"λ1 = {lambda1:.4f}")
    print(f"λ2 = {lambda2:.4f}")
    print(f"\nЗначение функции правдоподобия: {-result.fun:.2f}")
    print(f"Количество итераций: {result.nit}")

    #Вычисление MTTF
    mttf = calculate_mttf(beta1, eta1, beta2, eta2, lambda1)
    print("\nСреднее время до отказа (MTTF):")
    print("-----------------------------")
    print(f"MTTF: {mttf:.2f} часов")
    pfh = 1/mttf
    print(f"PFH: {pfh:.2e} 1/ч")
    #Вычисление SIL
    sil = calculate_sil(pfh)

    model = { "beta1": f"{beta1:.2f}", 
            "eta1": f"{eta1:.2f}", 
            "beta2": f"{beta2:.2f}", 
            "eta2": f"{eta2:.2f}", 
            "lambda1": f"{lambda1:.2f}", 
            "gamma1": f"{gamma1:.2f}", 
            "gamma2": f"{gamma2:.2f}", 
            "gamma3": f"{gamma2:.2f}",
            "mttf": f"{mttf:.2f}",
            "pfh": f"{pfh:.2e}",
            "sil": f"{sil:.0f}" }

    return model