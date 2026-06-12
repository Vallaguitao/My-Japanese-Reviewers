import unittest

from split_lesson_css import split, unscope_block, unscope_selector


class TestUnscopeSelector(unittest.TestCase):
    def test_descendant_class(self):
        self.assertEqual(
            unscope_selector('body[data-mjr-lesson="n5-1"] .progress-container', "n5-1"),
            ".progress-container",
        )

    def test_body_alone(self):
        self.assertEqual(unscope_selector('body[data-mjr-lesson="n5-1"]', "n5-1"), "body")

    def test_html_has(self):
        self.assertEqual(
            unscope_selector('html:has(body[data-mjr-lesson="n5-1"])', "n5-1"), "html"
        )

    def test_nested_descendant(self):
        self.assertEqual(
            unscope_selector('body[data-mjr-lesson="n5-1"] .title-slide .book-badge', "n5-1"),
            ".title-slide .book-badge",
        )

    def test_pseudo_class(self):
        self.assertEqual(
            unscope_selector('body[data-mjr-lesson="n5-1"] .nav-btn:hover', "n5-1"),
            ".nav-btn:hover",
        )

    def test_unexpected_selector_raises(self):
        with self.assertRaises(ValueError):
            unscope_selector(".unrelated", "n5-1")


class TestUnscopeBlock(unittest.TestCase):
    def test_multi_selector_universal(self):
        css = (
            'body[data-mjr-lesson="n5-1"] *, body[data-mjr-lesson="n5-1"] *::before, '
            'body[data-mjr-lesson="n5-1"] *::after {\n'
            "box-sizing: border-box;\n"
            "}"
        )
        expected = "*, *::before, *::after {\nbox-sizing: border-box;\n}"
        self.assertEqual(unscope_block(css, "n5-1"), expected)

    def test_media_query_wrapper_untouched(self):
        css = (
            "@media (max-width: 768px) {\n"
            'body[data-mjr-lesson="n5-1"] .progress-header {\n'
            "flex-direction: column;\n"
            "}\n"
            "}"
        )
        expected = (
            "@media (max-width: 768px) {\n"
            ".progress-header {\n"
            "flex-direction: column;\n"
            "}\n"
            "}"
        )
        self.assertEqual(unscope_block(css, "n5-1"), expected)


class TestSplit(unittest.TestCase):
    def test_split_two_lessons(self):
        text = (
            "/* Shared lesson presentation styles. Generated from the migrated lesson HTML in Phase 1. */\n"
            "body { color: red; }\n"
            "\n"
            "/* Legacy-compatible overrides: Lessons/N5-Lessons/Lesson_1.html */\n"
            'body[data-mjr-lesson="n5-1"] .foo {\n'
            "color: blue;\n"
            "}\n"
            "/* Legacy-compatible overrides: Lessons/N4-Lessons-Book-1/Lesson_2.html */\n"
            'body[data-mjr-lesson="n4b1-2"] .bar {\n'
            "color: green;\n"
            "}\n"
        )
        base_text, overrides = split(text)

        self.assertNotIn("Generated from the migrated lesson HTML", base_text)
        self.assertIn("body { color: red; }", base_text)
        self.assertEqual(set(overrides), {"n5-1", "n4b1-2"})
        self.assertIn(".foo {\ncolor: blue;\n}", overrides["n5-1"])
        self.assertIn(".bar {\ncolor: green;\n}", overrides["n4b1-2"])


if __name__ == "__main__":
    unittest.main()
