import os
import sys
import time
import os.path

current_year = time.strftime("%Y")

def main():
    inputs = sys.argv[1] # input string
    inputDict = eval('dict('+inputs+')') # convert input string into dict
    print(create_project_folder(inputDict))

def createFolder(directory):
    try:
        if not os.path.exists(directory):
            os.makedirs(directory)
    except OSError:
        print('Error: Creating directory. ' + directory)

def create_project_folder(inputs):
    project_dir = inputs['p_directory']
    
    # make new year folder if current year does not match dir list-------------
    project_dir_list = (os.listdir(project_dir))
    year_list = []

    for year in project_dir_list:
        try:
            if int(year[:5]) and len(year) < 5:
                year_list.append(year)
        except ValueError:
            continue
    year_list.sort()
    if year_list[-1] == str(current_year):
        year_dir = current_year
    else:
        createFolder(f'{project_dir}/{current_year}')
        createFolder(f'{project_dir}/{current_year}/HSE{current_year}')

    if inputs['p_sort'] == 'HSE':
        project_dir = f'{project_dir}/{current_year}/HSE{current_year}'

    project = f"{inputs['p_project_number']} {inputs['p_project_name']} {inputs['p_type_code']}"
    
    # create project folder and sub folders
    createFolder(f"{project_dir}/{f'{current_year}/' if inputs['p_sort'] != 'HSE' else ''}{project}/photos")
    createFolder(f"{project_dir}/{f'{current_year}/' if inputs['p_sort'] != 'HSE' else ''}{project}/test_reports")
    createFolder(f"{project_dir}/{f'{current_year}/' if inputs['p_sort'] != 'HSE' else ''}{project}/insurance_docs")
    createFolder(f"{project_dir}/{f'{current_year}/' if inputs['p_sort'] != 'HSE' else ''}{project}/minutes_etc")
    createFolder(f"{project_dir}/{f'{current_year}/' if inputs['p_sort'] != 'HSE' else ''}{project}/travel")
    createFolder(f"{project_dir}/{f'{current_year}/' if inputs['p_sort'] != 'HSE' else ''}{project}/tx")
    createFolder(f"{project_dir}/{f'{current_year}/' if inputs['p_sort'] != 'HSE' else ''}{project}/billing")
    createFolder(f"{project_dir}/{f'{current_year}/' if inputs['p_sort'] != 'HSE' else ''}{project}/billing/QB_Invoices")
    createFolder(f"{project_dir}/{f'{current_year}/' if inputs['p_sort'] != 'HSE' else ''}{project}/production")
    createFolder(f"{project_dir}/{f'{current_year}/' if inputs['p_sort'] != 'HSE' else ''}{project}/RFIs")
    createFolder(f"{project_dir}/{f'{current_year}/' if inputs['p_sort'] != 'HSE' else ''}{project}/Purchasing")
    createFolder(f"{project_dir}/{f'{current_year}/' if inputs['p_sort'] != 'HSE' else ''}{project}/Purchasing/vendor_quotes")
    createFolder(f"{project_dir}/{f'{current_year}/' if inputs['p_sort'] != 'HSE' else ''}{project}/Material_Specs")
    createFolder(f"{project_dir}/{f'{current_year}/' if inputs['p_sort'] != 'HSE' else ''}{project}/quotes")
    createFolder(f"{project_dir}/{f'{current_year}/' if inputs['p_sort'] != 'HSE' else ''}{project}/contracts")
    createFolder(f"{project_dir}/{f'{current_year}/' if inputs['p_sort'] != 'HSE' else ''}{project}/contracts/change_orders")
    createFolder(f"{project_dir}/{f'{current_year}/' if inputs['p_sort'] != 'HSE' else ''}{project}/contracts/closeout_documents")
    createFolder(f"{project_dir}/{f'{current_year}/' if inputs['p_sort'] != 'HSE' else ''}{project}/contracts/AIA_docs_for_pay_apps")
    createFolder(f"{project_dir}/{f'{current_year}/' if inputs['p_sort'] != 'HSE' else ''}{project}/contracts/backup_and_old_files")
    createFolder(f"{project_dir}/{f'{current_year}/' if inputs['p_sort'] != 'HSE' else ''}{project}/contracts/Exhibits")
    createFolder(f"{project_dir}/{f'{current_year}/' if inputs['p_sort'] != 'HSE' else ''}{project}/contracts/TX_Ex")
    createFolder(f"{project_dir}/{f'{current_year}/' if inputs['p_sort'] != 'HSE' else ''}{project}/drawings")
    createFolder(f"{project_dir}/{f'{current_year}/' if inputs['p_sort'] != 'HSE' else ''}{project}/drawings/drawings_sent")
    createFolder(f"{project_dir}/{f'{current_year}/' if inputs['p_sort'] != 'HSE' else ''}{project}/drawings/revisions")
    createFolder(f"{project_dir}/{f'{current_year}/' if inputs['p_sort'] != 'HSE' else ''}{project}/drawings/archive_dwgs")
    createFolder(f"{project_dir}/{f'{current_year}/' if inputs['p_sort'] != 'HSE' else ''}{project}/drawings/approved_dwgs")
    createFolder(f"{project_dir}/{f'{current_year}/' if inputs['p_sort'] != 'HSE' else ''}{project}/drawings/arch_dwgs")
    createFolder(f"{project_dir}/{f'{current_year}/' if inputs['p_sort'] != 'HSE' else ''}{project}/drawings/solidworks")
    createFolder(f"{project_dir}/{f'{current_year}/' if inputs['p_sort'] != 'HSE' else ''}{project}/drawings/typical_drawings")
    createFolder(f"{project_dir}/{f'{current_year}/' if inputs['p_sort'] != 'HSE' else ''}{project}/safety")
    
    directory =  f"{project_dir}/{f'{current_year}/' if inputs['p_sort'] != 'HSE' else ''}{project}"

    return directory

if __name__ == "__main__":
    main()
