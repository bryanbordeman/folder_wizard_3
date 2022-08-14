import sys
import os
import os.path
from database import execute_db_query

def main():
    inputs = sys.argv[1] # input string
    inputDict = eval('dict('+inputs+')') # convert input string into dict
    create_opp_record(inputDict)
    print('Opportunity Record Created')

def create_opp_record(inputs):
        '''write opportunity to database'''

        table = 'opportunity'

        # fix due date format
        due_date_list = inputs['due_date'].split('-') # break string into list
        due_date = f'{due_date_list[1]}/{due_date_list[2]}/{due_date_list[0][-2:]}' #reformat mm/dd/YYYY

        execute_db_query(f"""INSERT INTO {table} (
                                    quote_number,
                                    project_name,
                                    project_category,
                                    project_type,
                                    type_code,
                                    project_zip,
                                    customer_list,
                                    bid_due
                                    ) VALUES(?, ?, ?, ?, ?, ?, ?, ?);""",(str(inputs['quote_number']), 
                                    str(inputs['project_name']), 
                                    str(inputs['project_category']), 
                                    str(inputs['project_type']), 
                                    str(inputs['type_code']), 
                                    str(inputs['project_zip']), 
                                    str(inputs['customers']), 
                                    str(due_date)))

if __name__ == "__main__":
    main()