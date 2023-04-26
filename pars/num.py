import csv

# Читаем данные из файла output.csv
with open('output.csv', 'r', newline='', encoding='utf-8') as csvfile:
    reader = csv.reader(csvfile, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)
    data_chars = [row for row in reader][0]

# Добавляем номера перед каждым значением атрибута data-char
numbered_data_chars = [f"{i+1}{char}\n" for i, char in enumerate(data_chars)]

# Записываем пронумерованные значения в новый файл numbered_output.csv
with open('numbered_output.csv', 'w', encoding='utf-8') as csvfile:
    csvfile.writelines(numbered_data_chars)

print("Пронумерованные значения атрибута data-char записаны в файл 'numbered_output.csv'")
