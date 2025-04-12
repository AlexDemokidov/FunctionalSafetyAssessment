from PySpice.Doc.ExampleTools import find_libraries
from PySpice.Spice.Library import SpiceLibrary
from PySpice.Spice.Netlist import Circuit
from PySpice.Unit import *
from math import exp

def measure(project):

    #######################################
    ### Расчет электрических параметров ###
    #######################################

    circuit = Circuit('Project1')

    for component in project:
        if component.get('name')[0] == "R":
            circuit.R(component.get('name')[1:], component.get('node1'), component.get('node2'), component.get('value'))
            getattr(circuit, component.get('name')).plus.add_current_probe(circuit)
            # print(type + number, firstNode, secondNode, value)
        if component.get('name')[0] == "V":
            circuit.V(component.get('name')[1:], component.get('node1'), component.get('node2'), component.get('value'))
            # print(type + number, firstNode, secondNode, value)
        if component.get('name')[0] == "I":
            circuit.I(component.get('name')[1:], component.get('node1'), component.get('node2'), component.get('value'))
            # print(type + number, firstNode, secondNode, value)
        if component.get('name')[0] == "C":
            circuit.C(component.get('name')[1:], component.get('node1'), component.get('node2'), component.get('value'))
            # print(type + number, firstNode, secondNode, value)
        if component.get('type') == "D":
            circuit.X(component.get('name'), component.get('node1'), component.get('node2'), component.get('value'))
            # print(type + number, firstNode, secondNode, model)
        if component.get('type') == "Q":
            circuit.X(component.get('name'), component.get('node1'), component.get('node2'), component.get('node3'), component.get('value'))
            # print(type + number, firstNode, secondNode, thirdNode, model)

    simulator = circuit.simulator(temperature=22, nominal_temperature=22)
    analysis = simulator.operating_point()

    #########################
    ### Расчет тока ###
    #########################

    for component in project:
        if component.get('name')[0] == "R":
            component_node = str(component.get('name')).lower()
            for node in analysis.branches.values():
                node_current = str(node)
                if (component_node in node_current):
                    component['current'] = round(float(node), 4)
                    print("I:", component.get('name'), component.get('current'), "A")

    #########################
    ### Расчет напряжения ###
    #########################

    for component in project:
        if component.get('name')[0] == "R":
            component['voltage'] = float(component.get('current')) * float(component.get('value'))
            print("V:", component.get('name'), component.get('voltage'), "B")

    def calcultate_k_t(E_a, T):
        k_t = exp(((-E_a)/8.617*pow(10, -5))*((1/(T+273))-1/298))
        return k_t

    ####################################
    ### Расчет параметров надежности ###
    ####################################

    for component in project:
        #Микросхемы
        # if (component.get('type') == "Микросхемы цифровые"):
        #     lambda_crystal = 0.02
        #     lambda_body = 3 * pow(10, -5) * pow(4, 1.08)
        #     k_t = 232323 # заменить на формулу
        #     k_pr = 1
        #     k_e = 12
        #     component.set('failure_rate') = (lambda_crystal * k_t + lambda_body * k_e) * k_pr
        # if (component.get('type') == "Микросхемы аналоговые"):
        #     lambda_crystal = 0.02
        #     component.set('failure_rate') = 
        # if (component.get('type') == "Микросхемы памяти"):
        #     lambda_crystal = 0.02
        #     component.set('failure_rate') = 
        # if (component.get('type') == "Программируемые логические интегральные схемы"):
        #     lambda_crystal = 0.021
        #     component.set('failure_rate') = 
        # if (component.get('type') == "Микропроцессоры"):
        #     lambda_crystal = 0.2
        #     component.set('failure_rate') = 
        # if (component.get('type') == "Микросхемы GaAs СВЧ"):
        #     lambda_crystal = 4.5
        #     component.set('failure_rate') = 
        # if (component.get('type') == "Микросхемы ПАВ"):
        #     component.set('failure_rate') = 

        #Полупроводниковые приборы

        #Резисторы
        if (component.get('type') == "Резисторы постоянные пленочные, в т.ч поверхностного монтажа"):
            lambda_g = 0.0037
            k_t = calcultate_k_t(0.08, 22)
            k_r = pow((component.get('voltage') * (component.get('current'))), 0.39)
            s = (float(component.get('voltage')) * float(component.get('current'))) / float(component.get('power'))
            k_s = 0.71 * exp(1.1*s)
            k_pr = 1
            k_e = 87
            component['failure_rate'] = lambda_g * k_t * k_r * k_s * k_pr * k_e / pow(10, 6)
        if (component.get('type') == "Резисторы постоянные проволочные, кроме мощных"):
            lambda_g = 0.0024
            k_t = calcultate_k_t(0.08, 22)
            k_r = pow((component.get('voltage') * component.get('current')), 0.39)
            s = (float(component.get('voltage')) * float(component.get('current'))) / float(component.get('power'))
            k_s = 0.71 * exp(1.1*s)
            k_pr = 1
            k_e = 87
            component['failure_rate'] = lambda_g * k_t * k_r * k_s * k_pr * k_e / pow(10, 6)
        if (component.get('type') == "Резисторы постоянные проволочные мощные"):
            lambda_g = 0.0024
            k_t = calcultate_k_t(0.08, 22)
            k_r = pow((component.get('voltage') * component.get('current')), 0.39)
            s = (float(component.get('voltage')) * float(component.get('current'))) / float(component.get('power'))
            k_s = 0.54 * exp(2.04*s)
            k_pr = 1
            k_e = 87
            component['failure_rate'] = lambda_g * k_t * k_r * k_s * k_pr * k_e / pow(10, 6)
        if (component.get('type') == "Сборки резисторные, в т.ч. поверхностного монтажа"):
            lambda_g = 0.0019
            k_t = calcultate_k_t(0.2, 22)
            k_r = pow((component.get('voltage') * component.get('current')), 0.39)
            s = (float(component.get('voltage')) * float(component.get('current'))) / float(component.get('power'))
            k_s = 1
            k_pr = 1
            k_e = 87
            component['failure_rate'] = lambda_g * k_t * k_r * k_s * k_pr * k_e / pow(10, 6)
        if (component.get('type') == "Резисторы переменные проволочные, кроме мощных и полупрецизионных"):
            lambda_g = 0.0024
            k_t = calcultate_k_t(0.08, 22)
            k_r = pow((component.get('voltage') * component.get('current')), 0.39)
            s = (float(component.get('voltage')) * float(component.get('current'))) / float(component.get('power'))
            k_s = 0.71 * exp(1.1*s)
            k_pr = 1
            k_e = 87
            component['failure_rate'] = lambda_g * k_t * k_r * k_s * k_pr * k_e / pow(10, 6)
        if (component.get('type') == "Резисторы переменные проволочные мощные"):
            lambda_g = 0.0024
            k_t = calcultate_k_t(0.08, 22)
            k_r = pow((component.get('voltage') * component.get('current')), 0.39)
            s = (float(component.get('voltage')) * float(component.get('current'))) / float(component.get('power'))
            k_s = 0.71 * exp(1.1*s)
            k_pr = 1
            k_e = 87
            component['failure_rate'] = lambda_g * k_t * k_r * k_s * k_pr * k_e / pow(10, 6)
        if (component.get('type') == "Резисторы переменные прововолочные полупрецизионные"):
            lambda_g = 0.0024
            k_t = calcultate_k_t(0.2, 22)
            k_r = pow((component.get('voltage') * component.get('current')), 0.39)
            s = (float(component.get('voltage')) * float(component.get('current'))) / float(component.get('power'))
            k_s = 0.71 * exp(1.1*s)
            k_pr = 1
            k_e = 87
            component['failure_rate'] = lambda_g * k_t * k_r * k_s * k_pr * k_e / pow(10, 6)
        if (component.get('type') == "Резисторы переменные непроволочные, кроме прецизионных"):
            lambda_g = 0.0037
            k_t = calcultate_k_t(0.08, 22)
            k_r = pow((component.get('voltage') * component.get('current')), 0.39)
            s = (float(component.get('voltage')) * float(component.get('current'))) / float(component.get('power'))
            k_s = 0.71 * exp(1.1*s)
            k_pr = 1
            k_e = 87
            component['failure_rate'] = lambda_g * k_t * k_r * k_s * k_pr * k_e / pow(10, 6)
        if (component.get('type') == "Резисторы переменные непроволочные прецизионные"):
            lambda_g = 0.0037
            k_t = calcultate_k_t(0.2, 22)
            k_r = pow((component.get('voltage') * component.get('current')), 0.39)
            s = (float(component.get('voltage')) * float(component.get('current'))) / float(component.get('power'))
            k_s = 0.71 * exp(1.1*s)
            k_pr = 1
            k_e = 87
            component['failure_rate'] = lambda_g * k_t * k_r * k_s * k_pr * k_e / pow(10, 6)
        if (component.get('type') == "Терморезисторы"):
            lambda_g = 0.0019
            k_t = 1
            k_r = pow((component.get('voltage') * component.get('current')), 0.39)
            k_s = 1
            k_pr = 1
            k_e = 87
            component['failure_rate'] = lambda_g * k_t * k_r * k_s * k_pr * k_e / pow(10, 6)

        if (component.get('type') == "-"):
            component['failure_rate'] = "-"


        # component['mtbf'] = round(1 / float(component.get('failure_rate')))

    for component in project:
        component['current'] = str(component['current'])
        component['voltage'] = str(component['voltage'])
        component['failure_rate'] = str(component['failure_rate'])


    return project