import os
import sys
import time
import os.path
from directory_list import directory_list

current_year = time.strftime("%Y")
# current_year = '2023'

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
    project_dir = directory_list['project_dir']
    
    # make new year folder if current year does not match dir list-------------
    project_dir_list = (os.listdir(project_dir)) # list of folders in directory
    year_list = [] # list of years in directory

    for year in project_dir_list:
        try:
            if int(year[:5]) and len(year) < 5:
                year_list.append(year)
        except ValueError:
            continue
    year_list.sort()

    if year_list[-1] != str(current_year):
        # check if last number in year_list equals current year
        # if last number is not equal to year make new folder with current year.
        createFolder(f'{project_dir}/{current_year}')
        createFolder(f'{project_dir}/{current_year}/HSE{current_year}')
        
    #-------- piont directory according to project type ------

    if inputs['projectType'] == 1: # if equal to Projct type
        project_dir = f'{project_dir}/{current_year}'

    elif inputs['projectType'] == 2: # if equal to Service type
        project_dir = f'{project_dir}/Door Service/{current_year}'

    elif inputs['projectType'] == 3: # if equal to HSE type
        project_dir = f'{project_dir}/{current_year}/HSE{current_year}'

    directory = f"{project_dir}/{f'{current_year}/' if inputs['projectType'] == '3' else ''}{inputs['folderName']}"
    
    # # create project folder and sub folders
    createFolder(f"{directory}/photos")
    createFolder(f"{directory}/test_reports")
    createFolder(f"{directory}/insurance_docs")
    createFolder(f"{directory}/minutes_etc")
    createFolder(f"{directory}/travel")
    createFolder(f"{directory}/tx")
    createFolder(f"{directory}/billing")
    createFolder(f"{directory}/billing/QB_Invoices")
    createFolder(f"{directory}/production")
    createFolder(f"{directory}/RFIs")
    createFolder(f"{directory}/Purchasing")
    createFolder(f"{directory}/Purchasing/vendor_quotes")
    createFolder(f"{directory}/Material_Specs")
    createFolder(f"{directory}/quotes")
    createFolder(f"{directory}/contracts")
    createFolder(f"{directory}/contracts/change_orders")
    createFolder(f"{directory}/contracts/closeout_documents")
    createFolder(f"{directory}/contracts/AIA_docs_for_pay_apps")
    createFolder(f"{directory}/contracts/backup_and_old_files")
    createFolder(f"{directory}/contracts/Exhibits")
    createFolder(f"{directory}/contracts/TX_Ex")
    createFolder(f"{directory}/drawings")
    createFolder(f"{directory}/drawings/drawings_sent")
    createFolder(f"{directory}/drawings/revisions")
    createFolder(f"{directory}/drawings/archive_dwgs")
    createFolder(f"{directory}/drawings/approved_dwgs")
    createFolder(f"{directory}/drawings/arch_dwgs")
    createFolder(f"{directory}/drawings/solidworks")
    createFolder(f"{directory}/drawings/typical_drawings")
    createFolder(f"{directory}/safety")
    
    return directory

if __name__ == "__main__":
    main()
