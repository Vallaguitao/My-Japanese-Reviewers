import unittest

from relocate_root_after_links import move_root_after_links


class TestMoveRootAfterLinks(unittest.TestCase):
    def test_moves_root_after_last_link_two_link_head(self):
        text = (
            "<head>\n"
            "<style>\n"
            "  /* THEME comment */\n"
            "  :root {\n"
            "    --bg-card: #221d2e;\n"
            "    --accent-start: #e8b4c8;\n"
            "  }\n"
            "  .quiz { color: var(--accent-start); }\n"
            "</style>\n"
            '  <link rel="stylesheet" href="../assets/site-nav.css">\n'
            '  <link rel="stylesheet" href="../assets/contrast-fixes.css">\n'
            "</head>\n"
        )

        result = move_root_after_links(text)

        expected = (
            "<head>\n"
            "<style>\n"
            "  /* THEME comment */\n"
            "  \n"
            "  .quiz { color: var(--accent-start); }\n"
            "</style>\n"
            '  <link rel="stylesheet" href="../assets/site-nav.css">\n'
            '  <link rel="stylesheet" href="../assets/contrast-fixes.css">'
            "\n<style>\n"
            ":root {\n"
            "    --bg-card: #221d2e;\n"
            "    --accent-start: #e8b4c8;\n"
            "  }\n"
            "</style>\n"
            "</head>\n"
        )
        self.assertEqual(result, expected)

    def test_moves_root_after_last_link_four_link_head(self):
        text = (
            "<head>\n"
            "<style>\n"
            "  :root {\n"
            "    --accent: #8b5cf6;\n"
            "  }\n"
            "  .card { color: var(--accent); }\n"
            "</style>\n"
            '  <link rel="stylesheet" href="../assets/tokens.css">\n'
            '  <link rel="stylesheet" href="../assets/components.css">\n'
            '  <link rel="stylesheet" href="../assets/site-nav.css">\n'
            '  <link rel="stylesheet" href="../assets/contrast-fixes.css">\n'
            "</head>\n"
        )

        result = move_root_after_links(text)

        expected = (
            "<head>\n"
            "<style>\n"
            "  \n"
            "  .card { color: var(--accent); }\n"
            "</style>\n"
            '  <link rel="stylesheet" href="../assets/tokens.css">\n'
            '  <link rel="stylesheet" href="../assets/components.css">\n'
            '  <link rel="stylesheet" href="../assets/site-nav.css">\n'
            '  <link rel="stylesheet" href="../assets/contrast-fixes.css">'
            "\n<style>\n"
            ":root {\n"
            "    --accent: #8b5cf6;\n"
            "  }\n"
            "</style>\n"
            "</head>\n"
        )
        self.assertEqual(result, expected)

    def test_no_root_block_raises(self):
        text = (
            "<head>\n"
            "<style>\n"
            "  .card { color: red; }\n"
            "</style>\n"
            '  <link rel="stylesheet" href="../assets/contrast-fixes.css">\n'
            "</head>\n"
        )
        with self.assertRaises(ValueError):
            move_root_after_links(text)

    def test_multiple_root_blocks_raises(self):
        text = (
            "<head>\n"
            "<style>\n"
            "  :root { --accent: #8b5cf6; }\n"
            "  :root { --accent: #000000; }\n"
            "</style>\n"
            '  <link rel="stylesheet" href="../assets/contrast-fixes.css">\n'
            "</head>\n"
        )
        with self.assertRaises(ValueError):
            move_root_after_links(text)

    def test_no_stylesheet_link_raises(self):
        text = (
            "<head>\n"
            "<style>\n"
            "  :root { --accent: #8b5cf6; }\n"
            "  .card { color: var(--accent); }\n"
            "</style>\n"
            "</head>\n"
        )
        with self.assertRaises(ValueError):
            move_root_after_links(text)


if __name__ == "__main__":
    unittest.main()
