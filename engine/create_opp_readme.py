import os
import sys
import os.path

def main():
    inputs = sys.argv[1] # input string
    current_path = sys.argv[2] 
    inputDict = eval('dict('+inputs+')') # convert input string into dict
    make_readme(inputDict, current_path)
 
def make_readme(inputs, current_path):
    name_of_file = 'README'
    completeName = os.path.join(current_path, name_of_file + ".txt")

    readme = open(completeName, "w")

    due_date_list = inputs['due_date'].split('-') # break string into list
    due_date = f'{due_date_list[1]}/{due_date_list[2]}/{due_date_list[0][-2:]}' #reformat mm/dd/YYYY

    opportunity_info = f"Quote Number = {inputs['quote_number']}\nProject Name = {inputs['project_name']}\nProject Category = {inputs['project_category']}\nProject Type = {inputs['project_type']}\nProject Zip = {inputs['project_zip']}\nBid Due Date = {due_date}\nCustomer List = {inputs['customers']}"

    readme.write(opportunity_info)
    readme.close()

    return print('Opportunity Readme Created')

if __name__ == "__main__":
    main()