import unittest

from update_lesson_html import OLD_LINK, OLD_SCRIPT, updated_text


class TestUpdatedText(unittest.TestCase):
    def test_replaces_script_and_adds_link(self):
        text = (
            "<head>\n"
            f"{OLD_LINK}"
            '  <link rel="stylesheet" href="../../assets/site-nav.css">\n'
            "</head>\n"
            "<body>\n"
            f"{OLD_SCRIPT}"
            "</body>\n"
        )

        result = updated_text(text, "n5-1")

        self.assertIn(
            '  <link rel="stylesheet" href="../../assets/lesson/lesson.css">\n'
            '  <link rel="stylesheet" href="../../assets/lesson/overrides/n5-1.css">\n',
            result,
        )
        self.assertIn('  <script src="../../assets/lesson/lesson.js"></script>\n', result)
        self.assertNotIn('type="module"', result)

    def test_missing_link_raises(self):
        with self.assertRaises(ValueError):
            updated_text("<head></head>", "n5-1")


if __name__ == "__main__":
    unittest.main()
