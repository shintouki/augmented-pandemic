from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.firefox.firefox_binary import FirefoxBinary

import unittest

class NewVisitorTest(unittest.TestCase):

    def setUp(self):
        self.browser = webdriver.Firefox()
        self.browser.implicitly_wait(3)

    def tearDown(self):
        self.browser.quit()

    def test_site_startup(self):
        # Edith has heard about a cool new online to-do app. She goes
        # to check out its homepage
        self.browser.get('http://localhost:8000/game')

        # She notices the page title and header mention to-do lists
        self.assertIn('Augmented Pandemic Home Page', self.browser.title)
        header_text = self.browser.find_element_by_tag_name('h1').text
        self.assertIn('Announcements', header_text)


        self.fail('Finish the test!')

if __name__ == '__main__':
    unittest.main(warnings='ignore')
