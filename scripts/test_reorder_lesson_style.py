import unittest

from reorder_lesson_style import move_style_after_links


class TestMoveStyleAfterLinks(unittest.TestCase):
    def test_moves_style_block_after_four_links(self):
        text = (
            "<head>\n"
            "    <style>\n"
            "        :root { --primary: #1a365d; }\n"
            "    </style>\n"
            '  <link rel="stylesheet" href="../../assets/lesson/lesson.css">\n'
            '  <link rel="stylesheet" href="../../assets/lesson/overrides/n5-1.css">\n'
            '  <link rel="stylesheet" href="../../assets/site-nav.css">\n'
            '  <link rel="stylesheet" href="../../assets/contrast-fixes.css">\n'
            "</head>\n"
        )

        result = move_style_after_links(text)

        expected = (
            "<head>\n"
            '  <link rel="stylesheet" href="../../assets/lesson/lesson.css">\n'
            '  <link rel="stylesheet" href="../../assets/lesson/overrides/n5-1.css">\n'
            '  <link rel="stylesheet" href="../../assets/site-nav.css">\n'
            '  <link rel="stylesheet" href="../../assets/contrast-fixes.css">\n'
            "    <style>\n"
            "        :root { --primary: #1a365d; }\n"
            "    </style>\n"
            "</head>\n"
        )
        self.assertEqual(result, expected)

    def test_missing_style_raises(self):
        with self.assertRaises(ValueError):
            move_style_after_links("<head></head>")


if __name__ == "__main__":
    unittest.main()
