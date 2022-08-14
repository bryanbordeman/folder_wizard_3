import sys
import os
import os.path
from database import execute_db_query

def main():
    inputs = sys.argv[1] # input string
    inputDict = eval('dict('+inputs+')') # convert input string into dict
    create_project_record(inputDict)
    print(f"{inputDict['p_sort']} Record Created")
    # print(inputDict)

def create_project_record(inputs):
        '''write project to database'''

        table = str(inputs['p_sort'])

        execute_db_query(f"""INSERT INTO {table} (
                                    project_number,
                                    project_name,
                                    project_category,
                                    project_type,
                                    type_code,
                                    project_zip,
                                    customer,
                                    quote,
                                    terms,
                                    tax,
                                    billing,
                                    labor_code,
                                    order_type,
                                    price
                                    ) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);""", (str(inputs['p_project_number']),
                                    str(inputs['p_project_name']),
                                    str(inputs['p_project_category']),
                                    str(inputs['p_project_type']),
                                    str(inputs['p_type_code']),
                                    str(inputs['p_project_zip']),
                                    str(inputs['p_customer']),
                                    str(inputs['p_opportunity']),
                                    str(inputs['p_project_terms']),
                                    str(inputs['p_tax']),
                                    str(inputs['p_project_billing']),
                                    str(inputs['p_labor']),
                                    str(inputs['p_project_order']),
                                    str(inputs['p_price'])))

if __name__ == "__main__":
    main()