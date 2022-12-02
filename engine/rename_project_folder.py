import os
import sys
import os.path
import time
from directory_list import directory_list

def main():
    inputs = sys.argv # inputs list
    #* inputs[1] = exisitng directory
    #* inputs[2] = new directory
    #* inputs[3] = project type
    print(rename_project_folder(inputs[1], inputs[2], int(inputs[3])))

def renameFolder(existing_dir, new_dir):
    try:
        if os.path.exists(existing_dir):
            os.rename(existing_dir, new_dir)
            print('Renamed!!')
        else:
            print('Error: renaming directory. ' + existing_dir)
    except OSError:
        print('Error: renaming directory. ' + existing_dir)

def is_int(var):
    try:
        int(var)
        return True
    except ValueError:
        return False

def rename_project_folder(existing, new, project_type):
    main_project_dir = directory_list['project_dir']

    #-------- piont directory according to project type ------

    if project_type == 1: # if equal to Project type
        is_project = is_int(existing[0:5]) # check string to confirm its a project number
    
        if is_project:
            project_year = f'20{existing[3:5]}' 
            project_dir = f'{main_project_dir}/{project_year}/{existing}'
            new_dir = f'{main_project_dir}/{project_year}/{new}'
            renameFolder(project_dir, new_dir)

    elif project_type == 2: # if equal to Service type
        is_service = is_int(existing[3:5]) # check string to confirm its a project number
    
        if is_service:
            project_year = f'20{existing[3:5]}' 
            project_dir = f'{main_project_dir}/Door Service/{project_year}/{existing}'
            new_dir = f'{main_project_dir}/Door Service/{project_year}/{new}'
            renameFolder(project_dir, new_dir)

    elif project_type == 3: # if equal to HSE type
        is_hse = is_int(existing[3:5]) # check string to confirm its a project number

        if is_hse:
            project_year = f'20{existing[3:5]}' 
            project_dir = f'{main_project_dir}/{project_year}/HSE{project_year}/{existing}'
            new_dir = f'{main_project_dir}/{project_year}/HSE{project_year}/{new}'
            renameFolder(project_dir, new_dir)
        
        return new_dir

if __name__ == "__main__":
    main()