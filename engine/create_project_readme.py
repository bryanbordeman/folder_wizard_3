import os
import sys
import os.path

def main():
    inputs = sys.argv[1] # input string
    current_path = sys.argv[2] 
    inputDict = eval('dict('+inputs+')') # convert input string into dict
    make_readme(inputDict, current_path)
    # print('create readme working!!')
 
 
def make_readme(inputs, current_path):
    name_of_file = 'README'
    completeName = os.path.join(current_path, name_of_file + ".txt")

    readme = open(completeName, "w")

    if inputs['p_tax'] == 'false':
        tax = 'NO'
    else:
        tax = "YES"

    billing_dict = {'?': 'Unknown', 'Q': 'QuickBooks', 'A': 'AIA', 'T': 'Textura', '*': 'Other'}

    project_info = f"Project Number = {inputs['p_project_number']}\nProject Name = {inputs['p_project_name']}\nProject Category = {inputs['p_project_category']}\nProject Type = {inputs['p_project_type']}\nProject Zip = {inputs['p_project_zip']}\nCustomer = {inputs['p_customer']}\nQuote Number = {inputs['p_opportunity']}\nTerms = {inputs['p_project_terms']}\nTax Exempt = {tax}\nBilling Type = {billing_dict[inputs['p_project_billing']]}\nSell Price (USD) = ${inputs['p_price']}\n"

    readme.write(project_info)
    readme.close()

    return print('Project Readme Created')

if __name__ == "__main__":
    main()