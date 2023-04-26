from selenium import webdriver
from bs4 import BeautifulSoup
import csv
import time

# Замените 'your_url' на URL страницы, с которой вы хотите извлечь атрибуты data-char
url = 'https://akanji.ru/JLPT/N2'

# Укажите путь к веб-драйверу Chrome
chrome_driver_path = "C:\\pars\\chromedriver.exe"
driver = webdriver.Chrome(chrome_driver_path)

driver.get(url)

# Ждем, пока JavaScript загрузит контент (увеличьте время ожидания при необходимости)
time.sleep(5)

content = driver.page_source
driver.quit()

soup = BeautifulSoup(content, 'html.parser')

# Ищем все элементы, которые содержат атрибут data-char
elements = soup.find_all(attrs={'data-char': True})

if not elements:
    print("Не найдено элементов с атрибутом data-char")
    exit(1)

# Извлекаем значения атрибута data-char из найденных элементов
data_chars = [element['data-char'] for element in elements]

# Записываем значения атрибута data-char в файл
with open('output.csv', 'a', newline='', encoding='utf-8') as csvfile:
    writer = csv.writer(csvfile, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)
    writer.writerow(data_chars)

print("Значения атрибута data-char записаны в файл 'output.csv'")
