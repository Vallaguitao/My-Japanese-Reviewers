import unittest

from lesson_ids import lesson_id_from_path


class TestLessonIdFromPath(unittest.TestCase):
    def test_n5(self):
        self.assertEqual(lesson_id_from_path("Lessons/N5-Lessons/Lesson_1.html"), "n5-1")

    def test_n4b1(self):
        self.assertEqual(lesson_id_from_path("Lessons/N4-Lessons-Book-1/Lesson_12.html"), "n4b1-12")

    def test_n4b2(self):
        self.assertEqual(lesson_id_from_path("Lessons/N4-Lessons-Book 2/Lesson_3.html"), "n4b2-3")

    def test_unrecognized(self):
        with self.assertRaises(ValueError):
            lesson_id_from_path("Lessons/Unknown/Lesson_1.html")


if __name__ == "__main__":
    unittest.main()
