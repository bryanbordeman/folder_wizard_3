import os
import os.path
import sqlite3
import time

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
database = os.path.join(BASE_DIR, "protaskinate.db")


def main():
    pass

def execute_db_query(query, parameters=()):
        with sqlite3.connect(database) as conn:
            cursor = conn.cursor()
            query_result = cursor.execute(query, parameters)
            conn.commit()
        return query_result

# def create_table():
#     execute_db_query(f"""CREATE TABLE IF NOT EXISTS 'service' (
#                     id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
#                     project_number text,
#                     project_name text,
#                     project_category text,
#                     project_type text,
#                     type_code text,
#                     project_zip text,
#                     customer text,
#                     quote text,
#                     terms text,
#                     tax text,
#                     billing text,
#                     labor_code text,
#                     order_type text,
#                     price text
#                     );""")

# def add_to_table():
#     table = 'service'
#     execute_db_query(f"""INSERT INTO {table} (
#                                     project_number,
#                                     project_name,
#                                     project_category,
#                                     project_type,
#                                     type_code,
#                                     project_zip,
#                                     customer,
#                                     quote,
#                                     terms,
#                                     tax,
#                                     billing,
#                                     labor_code,
#                                     order_type,
#                                     price
#                                     ) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);""", (str(21116),
#                                     str("LG Health"),
#                                     str("Door Service"),
#                                     str('RF Door Service'),
#                                     str("SVC-RFS"),
#                                     str(17601),
#                                     str('LG Health'),
#                                     str('Q21-230'),
#                                     str('NET 30'),
#                                     str('No'),
#                                     str('Unknown'),
#                                     str(''),
#                                     str('House'),
#                                     str(3177))
#                                     )

# def get_next_HSE():
#     year = time.strftime("%Y")[2:]
#     table = 'HSE'

#     table_str = execute_db_query(
#             f"SELECT * FROM {table} ORDER BY rowid DESC LIMIT 1;")  # makes

#     last_HSE_number = (table_str.fetchall()[0][1])
#     current_service_year = last_HSE_number[3:5]

#     if current_service_year == year:
#         next_number = int(last_HSE_number[-2:])+1
#         if len(str(next_number)) == 1:
#             next_number_str = f'HSE{current_service_year}0{next_number}'
#         elif len(str(next_number)) == 2:
#             next_number_str = f'HSE{current_service_year}{next_number}'
#     else:
#         next_number = '01'
#         next_number_str = f'HSE{year}{next_number}'

#     return next_number_str

if __name__ == "__main__":
    main()