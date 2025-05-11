{
    "project": [
        {
            "name": "Недостаточная емкость",
            "time": "100",
            "parameter1": "78",
            "parameter2": "43",
            "parameter3": "68"
        }
    ]
}


{
    "detail": [
        {
            "type": "missing",
            "loc": [
                "body",
                "project"
            ],
            "msg": "Field required",
            "input": {
                "data": {
                    "project": [
                        {
                            "key": "1",
                            "name": "Недостаточная емкость",
                            "time": "100",
                            "parameter1": "78",
                            "parameter2": "43",
                            "parameter3": "68"
                        },
                        {
                            "key": "2",
                            "name": "Перегрев",
                            "time": "56",
                            "parameter1": "30",
                            "parameter2": "89",
                            "parameter3": "25"
                        }
                    ],
                    "analysis": "Weibull"
                }
            }
        }
    ]
}

{
    "detail": [
        {
            "type": "list_type",
            "loc": [
                "body",
                "project"
            ],
            "msg": "Input should be a valid list",
            "input": {
                "project": [
                    {
                        "key": "1",
                        "name": "Недостаточная емкость",
                        "time": "100",
                        "parameter1": "78",
                        "parameter2": "43",
                        "parameter3": "68"
                    },
                    {
                        "key": "2",
                        "name": "Перегрев",
                        "time": "56",
                        "parameter1": "30",
                        "parameter2": "89",
                        "parameter3": "25"
                    }
                ]
            }
        }
    ]
}

{
    "project": [
        {
            "name": "string",
            "time": "string",
            "parameter1": "string",
            "parameter2": "string",
            "parameter3": "string"
        }
    ]
}