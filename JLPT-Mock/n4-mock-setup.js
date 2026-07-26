(function() {
  const processedQuestions = [
  {
    "lesson": 1,
    "type": "N5 · 文法1",
    "stem": "Q2hvb3NlIHRoZSBjb3JyZWN0IHBhcnRpY2xlOjxicj48c3BhbiBjbGFzcz0ianAiPuOCj+OBn+OBlzxzcGFuIGNsYXNzPSJibGFuayI+Pzwvc3Bhbj4gPHJ1Ynk+55Sw5LitPHJ0PuOBn+OBquOBizwvcnQ+PC9ydWJ5PuOBp+OBmeOAgjwvc3Bhbj4=",
    "answer": "44Gv",
    "choices": [
      "は",
      "が",
      "を",
      "の"
    ],
    "correctNote": "44GvIG1hcmtzIHRoZSB0b3BpYyDigJQgIjxlbT5hcyBmb3IgbWU8L2VtPiwgKEkgYW0pIFRhbmFrYS4i",
    "explain": "VGhlIE41IGJhY2tib25lIHBhdHRlcm46IDxzcGFuIGNsYXNzPSJqcCI+W3RvcGljXSDjga8gW3ByZWRpY2F0ZV0g44Gn44GZPC9zcGFuPi4g44GvIGludHJvZHVjZXMgd2hhdCB3ZSdyZSB0YWxraW5nIGFib3V0Lg==",
    "connect": "8J+UlyBUaGUgc2FtZSDjga8gcmV0dXJucyBpbiBMMiAo44GT44KM44Gv4oCmKSwgTDMgKOOBk+OBk+OBr+KApiksIEw4IChB44GvIGFkaiDjgafjgZkpLCBhbmQgZXZlcnkgbGF0ZXIgbGVzc29uIOKAlCBpdCBuZXZlciBnb2VzIGF3YXku",
    "warn": "4pqg77iPIFByb25vdW5jZWQg44CMPHNwYW4gY2xhc3M9ImpwIj7jgo88L3NwYW4+44CNICh3YSkg4oCUIG5ldmVyICJoYSIg4oCUIHdoZW4gdXNlZCBhcyBhIHBhcnRpY2xlLg=="
  },
  {
    "lesson": 1,
    "type": "N5 · 文法1",
    "stem": "Q2hvb3NlIHRoZSBjb3JyZWN0IHBhcnRpY2xlOjxicj48c3BhbiBjbGFzcz0ianAiPuODnuOCpOOCr+OBleOCk+OBryBJTUM8c3BhbiBjbGFzcz0iYmxhbmsiPj88L3NwYW4+IDxydWJ5PuekvuWToTxydD7jgZfjgoPjgYTjgpM8L3J0PjwvcnVieT7jgafjgZnjgII8L3NwYW4+",
    "answer": "44Gu",
    "choices": [
      "の",
      "は",
      "に",
      "で"
    ],
    "correctNote": "44GuIGxpbmtzIHR3byBub3VuczogPHNwYW4gY2xhc3M9ImpwIj5JTUPjga7npL7lk6E8L3NwYW4+ID0gImFuIGVtcGxveWVlIDxlbT5vZjwvZW0+IElNQy4i",
    "explain": "PHNwYW4gY2xhc3M9ImpwIj5O4oKBIOOBriBO4oKCPC9zcGFuPiA9ICJO4oKBJ3MgTuKCgiIgb3IgIk7igoIgb2YgTuKCgS4iIFRoZSBmaXJzdCBub3VuIGRlc2NyaWJlcyBvciBvd25zIHRoZSBzZWNvbmQu",
    "connect": "8J+UlyBJbiBMMiB5b3UnbGwgc2VlIDxzcGFuIGNsYXNzPSJqcCI+44KP44Gf44GX44GuPHJ1Ynk+5pysPHJ0PuOBu+OCkzwvcnQ+PC9ydWJ5Pjwvc3Bhbj4uIEluIEwyMiB0aGUgc2FtZSDjga4gcGxheXMgYSBORVcgcm9sZSDigJQgY29ubmVjdGluZyB3aG9sZSBjbGF1c2VzIHRvIG5vdW5zLg==",
    "warn": null
  },
  {
    "lesson": 2,
    "type": "N5 · 文法1",
    "stem": "IlRoYXQgYm9vayBvdmVyIHRoZXJlIChmYXIgZnJvbSB1cyBib3RoKSI6PGJyPjxzcGFuIGNsYXNzPSJqcCI+PHNwYW4gY2xhc3M9ImJsYW5rIj4/PC9zcGFuPiDjga8gPHJ1Ynk+5pysPHJ0PuOBu+OCkzwvcnQ+PC9ydWJ5PuOBp+OBmeOAgjwvc3Bhbj4=",
    "answer": "44GC44KM",
    "choices": [
      "これ",
      "それ",
      "あれ",
      "どれ"
    ],
    "correctNote": "PHNwYW4gY2xhc3M9ImpwIj7jgYLjgow8L3NwYW4+ID0gInRoYXQgdGhpbmcgb3ZlciB0aGVyZSIg4oCUIGZhciBmcm9tIEJPVEggc3BlYWtlciBhbmQgbGlzdGVuZXIu",
    "explain": "44GT44KMID0gbmVhciBtZSDCtyDjgZ3jgowgPSBuZWFyIHlvdSDCtyDjgYLjgowgPSBmYXIgZnJvbSBib3RoIMK3IOOBqeOCjCA9IHdoaWNoIG9uZT8=",
    "connect": "8J+UlyBUaGUg44GT44O744Gd44O744GC44O744GpIHN5c3RlbSBleHRlbmRzIHRvIDxzcGFuIGNsYXNzPSJqcCI+44GT44GuL+OBneOBri/jgYLjga4v44Gp44GuICsgTjwvc3Bhbj4gKEwyKSwgPHNwYW4gY2xhc3M9ImpwIj7jgZPjgZMv44Gd44GTL+OBguOBneOBky/jganjgZM8L3NwYW4+IChMMyksIGFuZCB0aGUgcG9saXRlIDxzcGFuIGNsYXNzPSJqcCI+44GT44Gh44KJL+OBneOBoeOCiS/jgYLjgaHjgokv44Gp44Gh44KJPC9zcGFuPiAoTDMpLg==",
    "warn": null
  },
  {
    "lesson": 3,
    "type": "N5 · 文法1",
    "stem": "IldoZXJlIGlzIHRoZSBiYXRocm9vbT8iOjxicj48c3BhbiBjbGFzcz0ianAiPuODiOOCpOODrOOBryA8c3BhbiBjbGFzcz0iYmxhbmsiPj88L3NwYW4+IOOBp+OBmeOBi+OAgjwvc3Bhbj4=",
    "answer": "44Gp44GT",
    "choices": [
      "どこ",
      "どれ",
      "どの",
      "なに"
    ],
    "correctNote": "PHNwYW4gY2xhc3M9ImpwIj7jganjgZM8L3NwYW4+ID0gIndoZXJlLiIgUGF0dGVybjogPHNwYW4gY2xhc3M9ImpwIj5OIOOBryDjganjgZMg44Gn44GZ44GLPC9zcGFuPi4=",
    "explain": "Rm9yIHBvbGl0ZSBzcGVlY2ggKHRvIGEgc3RyYW5nZXIgb3IgY3VzdG9tZXIpLCB1c2UgPHNwYW4gY2xhc3M9ImpwIj7jganjgaHjgok8L3NwYW4+LiA8c3BhbiBjbGFzcz0ianAiPuOBqeOCjDwvc3Bhbj4gPSAid2hpY2ggb25lPyIg4oCUIG5vdCAid2hlcmUuIg==",
    "connect": "8J+UlyBMMyBhbHNvIHBhaXJzIOOBqeOBkyB3aXRoIDxzcGFuIGNsYXNzPSJqcCI+44GT44GT44O744Gd44GT44O744GC44Gd44GTPC9zcGFuPi4gTDUgZXhwYW5kcyB3aXRoIDxzcGFuIGNsYXNzPSJqcCI+44Gp44GTW+OBuF3jgoIgKyDjgb7jgZvjgpM8L3NwYW4+ICg9ICJub3doZXJlIiku",
    "warn": null
  },
  {
    "lesson": 4,
    "type": "N5 · 文法1",
    "stem": "IkkgZ2V0IHVwIGF0IDYgbydjbG9jayI6PGJyPjxzcGFuIGNsYXNzPSJqcCI+PHJ1Ynk+NuaZgjxydD7jgo3jgY/jgZg8L3J0PjwvcnVieT48c3BhbiBjbGFzcz0iYmxhbmsiPj88L3NwYW4+IDxydWJ5Pui1tzxydD7jgYo8L3J0PjwvcnVieT7jgY3jgb7jgZnjgII8L3NwYW4+",
    "answer": "44Gr",
    "choices": [
      "に",
      "で",
      "を",
      "へ"
    ],
    "correctNote": "PHNwYW4gY2xhc3M9ImpwIj7jgas8L3NwYW4+IG1hcmtzIGEgU1BFQ0lGSUMgcG9pbnQgaW4gdGltZSDigJQgY2xvY2sgdGltZXMsIGRhdGVzLCBkYXlzIG9mIHRoZSB3ZWVrLg==",
    "explain": "VXNlIOOBqyBvbmx5IHdpdGggdGltZXMgdGhhdCBoYXZlIE5VTUJFUlMgb3Igc3BlY2lmaWMgbmFtZXMuIDxzcGFuIGNsYXNzPSJqcCI+44GN44KH44GG44O744GC44GX44Gf44O744GE44G+44O744G+44GE44Gr44GhPC9zcGFuPiB0YWtlIE5PIHBhcnRpY2xlLg==",
    "connect": "8J+UlyBUaGUgc2FtZSDjgasgcmVhcHBlYXJzIGluIEw3IChyZWNpcGllbnQ6IOOAnOOBq+OBguOBkuOCiyksIEwxMCAoZXhpc3RlbmNlOiDpg6jlsYvjgavjgJzjgYzjgYLjgorjgb7jgZkpLCBMMTMgKHB1cnBvc2U6IOmjn+OBueOBq+ihjOOBjyksIEwxOCAo44G+44GI44GrKS4=",
    "warn": "4pqg77iPIDxzcGFuIGNsYXNzPSJqcCI+44GN44KH44GGIOOBqzwvc3Bhbj4g4pyXIOKAlCByZWxhdGl2ZSB0aW1lIHdvcmRzIG5ldmVyIHRha2Ug44GrLg=="
  },
  {
    "lesson": 4,
    "type": "N5 · 文法2 ★",
    "stem": "QnVpbGQgdGhlIHNlbnRlbmNlIGJ5IG9yZGVyaW5nIHRoZSA0IGZyYWdtZW50cy4gV2hpY2ggd29yZCBnb2VzIGluIHRoZSDimIUgcG9zaXRpb24/PGJyPjxicj48c3BhbiBjbGFzcz0ianAiPjxydWJ5PuWtpuagoTxydD7jgYzjgaPjgZPjgYY8L3J0PjwvcnVieT7jga8gPHNwYW4gY2xhc3M9ImJsYW5rIj7ikaA8L3NwYW4+IDxzcGFuIGNsYXNzPSJibGFuayI+4piFPC9zcGFuPiA8c3BhbiBjbGFzcz0iYmxhbmsiPuKRojwvc3Bhbj4gPHNwYW4gY2xhc3M9ImJsYW5rIj7ikaM8L3NwYW4+IOOBp+OBmeOAgjwvc3Bhbj48YnI+PGJyPldvcmQgYmFuazogPHNwYW4gY2xhc3M9ImpwIj4zPHJ1Ynk+5pmCPHJ0PuOBmDwvcnQ+PC9ydWJ5PiDCtyA5PHJ1Ynk+5pmCPHJ0PuOBmDwvcnQ+PC9ydWJ5PiDCtyDjgb7jgacgwrcg44GL44KJPC9zcGFuPg==",
    "answer": "44GL44KJ",
    "choices": [
      "9時",
      "から",
      "3時",
      "まで"
    ],
    "correctNote": "4piFIHBvc2l0aW9uIChzbG90IDIpID0gPHNwYW4gY2xhc3M9ImpwIj7jgYvjgok8L3NwYW4+LiBCdWlsdDogPHNwYW4gY2xhc3M9ImpwIj7lrabmoKHjga8gPHN0cm9uZz455pmCIOOBi+OCiSAz5pmCIOOBvuOBpzwvc3Ryb25nPiDjgafjgZnjgII8L3NwYW4+",
    "explain": "PHNwYW4gY2xhc3M9ImpwIj5O4oKBIOOBi+OCiSBO4oKCIOOBvuOBpzwvc3Bhbj4gPSAiZnJvbSBO4oKBIHVudGlsIE7igoIuIiBGb3IgdGltZSByYW5nZXMsIGRpc3RhbmNlcywgYW5kIHByaWNlIHJhbmdlcy4=",
    "connect": "8J+UlyBJbiBMOSB0aGUgc2FtZSDjgYvjgokgZXZvbHZlcyBpbnRvIGEgUkVBU09OIG1hcmtlcjogPHNwYW4gY2xhc3M9ImpwIj5+44GL44KJ44CBfjwvc3Bhbj4gPSAiYmVjYXVzZX4iLiBTYW1lIHdvcmQsIHZlcnkgZGlmZmVyZW50IGpvYiE=",
    "warn": null
  },
  {
    "lesson": 5,
    "type": "N5 · 文法1",
    "stem": "IkkgZ28gdG8gc2Nob29sIGJ5IGJpY3ljbGUiOjxicj48c3BhbiBjbGFzcz0ianAiPuOBmOOBpuOCk+OBl+OCgzxzcGFuIGNsYXNzPSJibGFuayI+Pzwvc3Bhbj4gPHJ1Ynk+5a2m5qChPHJ0PuOBjOOBo+OBk+OBhjwvcnQ+PC9ydWJ5PuOBuCA8cnVieT7ooYw8cnQ+44GEPC9ydD48L3J1Ynk+44GN44G+44GZ44CCPC9zcGFuPg==",
    "answer": "44Gn",
    "choices": [
      "で",
      "に",
      "を",
      "と"
    ],
    "correctNote": "PHNwYW4gY2xhc3M9ImpwIj7jgac8L3NwYW4+IG1hcmtzIHRoZSBtZWFucy92ZWhpY2xlOiA8c3BhbiBjbGFzcz0ianAiPuOBmOOBpuOCk+OBl+OCg+OBpzwvc3Bhbj4gPSAiYnkgYmljeWNsZS4i",
    "explain": "U2FtZSDjgacgYWxzbyBtYXJrcyB0b29scy9pbnN0cnVtZW50cyBpbiBMNyAoPHNwYW4gY2xhc3M9ImpwIj7jga/jgZfjgafpo5/jgbnjgos8L3NwYW4+KSBhbmQgbGFuZ3VhZ2UgKDxzcGFuIGNsYXNzPSJqcCI+5pel5pys6Kqe44GnPHJ1Ynk+6KmxPHJ0PuOBr+OBqjwvcnQ+PC9ydWJ5PuOBmTwvc3Bhbj4pLg==",
    "connect": "8J+UlyDjgacgaGFzIEZPVVIgcm9sZXMgYnkgTDc6IHZlaGljbGUgKEw1KSwgdG9vbC9sYW5ndWFnZSAoTDcpLCBsb2NhdGlvbiBvZiBhY3Rpb24gKEw2OiDjg6zjgrnjg4jjg6njg7Pjgafpo5/jgbnjgospLCAiaW4gdG90YWwiIChMMTEpLg==",
    "warn": "4pqg77iPIDxzcGFuIGNsYXNzPSJqcCI+44GC44KL44GE44GmPC9zcGFuPiAoIm9uIGZvb3QiKSBkb2VzIE5PVCB0YWtlIOOBpyDigJQgaXQncyBhbHJlYWR5IGEg44GmLWZvcm0u"
  },
  {
    "lesson": 6,
    "type": "N5 · 文法1",
    "stem": "IkkgZHJpbmsgY29mZmVlIGV2ZXJ5IG1vcm5pbmciOjxicj48c3BhbiBjbGFzcz0ianAiPjxydWJ5PuavjuacnTxydD7jgb7jgYTjgYLjgZU8L3J0PjwvcnVieT4g44Kz44O844OS44O8PHNwYW4gY2xhc3M9ImJsYW5rIj4/PC9zcGFuPiA8cnVieT7po7I8cnQ+44GuPC9ydD48L3J1Ynk+44G/44G+44GZ44CCPC9zcGFuPg==",
    "answer": "44KS",
    "choices": [
      "を",
      "が",
      "は",
      "に"
    ],
    "correctNote": "PHNwYW4gY2xhc3M9ImpwIj7jgpI8L3NwYW4+IG1hcmtzIHRoZSBkaXJlY3Qgb2JqZWN0IG9mIGEgdHJhbnNpdGl2ZSB2ZXJiLg==",
    "explain": "VHJhbnNpdGl2ZSB2ZXJicyAoc29tZXRoaW5nIGRvbmUgVE8gYW4gb2JqZWN0KSB0YWtlIOOCkjogPHNwYW4gY2xhc3M9ImpwIj7po5/jgbnjgovjg7vpo7LjgoDjg7s8cnVieT7osrc8cnQ+44GLPC9ydD48L3J1Ynk+44GG44O7PHJ1Ynk+6KqtPHJ0PuOCiDwvcnQ+PC9ydWJ5PuOCgOODuzxydWJ5PuimizxydD7jgb88L3J0PjwvcnVieT7jgos8L3NwYW4+Lg==",
    "connect": "8J+UlyBUaGUgc2FtZSDjgpIgcmV0dXJucyBpbiBMMTMgKG1vdmVtZW50IHRhcmdldDogPHJ1Ynk+5YWs5ZySPHJ0PuOBk+OBhuOBiOOCkzwvcnQ+PC9ydWJ5PuOCkjxydWJ5PuaVo+atqTxydD7jgZXjgpPjgb08L3J0PjwvcnVieT7jgZnjgospIGFuZCBMMTYgKGxlYXZpbmc6IDxydWJ5PuWutjxydD7jgYTjgYg8L3J0PjwvcnVieT7jgpI8cnVieT7lh7o8cnQ+44GnPC9ydD48L3J1Ynk+44KLKS4=",
    "warn": "4pqg77iPIDxzcGFuIGNsYXNzPSJqcCI+44KSPC9zcGFuPiBpcyBwcm9ub3VuY2VkICJvLCIgYW5kIHVzZWQgT05MWSBhcyBhIHBhcnRpY2xlLg=="
  },
  {
    "lesson": 6,
    "type": "N5 · 文法2 ★",
    "stem": "QnVpbGQgdGhlIHNlbnRlbmNlIGJ5IG9yZGVyaW5nIHRoZSA0IGZyYWdtZW50cy4gV2hpY2ggd29yZCBnb2VzIGluIHRoZSDimIUgcG9zaXRpb24/PGJyPjxicj48c3BhbiBjbGFzcz0ianAiPuOBhOOBo+OBl+OCh+OBqyA8c3BhbiBjbGFzcz0iYmxhbmsiPuKRoDwvc3Bhbj4gPHNwYW4gY2xhc3M9ImJsYW5rIj7ikaE8L3NwYW4+IDxzcGFuIGNsYXNzPSJibGFuayI+4piFPC9zcGFuPiA8c3BhbiBjbGFzcz0iYmxhbmsiPuKRozwvc3Bhbj4g44GL44CCPC9zcGFuPjxicj48YnI+V29yZCBiYW5rOiA8c3BhbiBjbGFzcz0ianAiPuOBvuOBm+OCkyDCtyDjgZTjga/jgpMgwrcgPHJ1Ynk+6aOfPHJ0PuOBnzwvcnQ+PC9ydWJ5PuOBuSDCtyDjgpI8L3NwYW4+",
    "answer": "6aOf44G5",
    "choices": [
      "ごはん",
      "を",
      "食べ",
      "ません"
    ],
    "correctNote": "4piFIHBvc2l0aW9uIChzbG90IDMpID0gPHNwYW4gY2xhc3M9ImpwIj7po5/jgbk8L3NwYW4+LiBCdWlsdDogPHNwYW4gY2xhc3M9ImpwIj7jgYTjgaPjgZfjgofjgasgPHN0cm9uZz7jgZTjga/jgpMg44KSIOmjn+OBuSDjgb7jgZvjgpM8L3N0cm9uZz4g44GL44CCPC9zcGFuPg==",
    "explain": "PHNwYW4gY2xhc3M9ImpwIj5+44G+44Gb44KT44GLPC9zcGFuPiBpcyBhIHBvbGl0ZSBpbnZpdGF0aW9uIOKAlCBzb2Z0ZXIgdGhhbiA8c3BhbiBjbGFzcz0ianAiPn7jgb7jgZfjgofjgYY8L3NwYW4+LiBUaGUgdmVyYiBzdGVtICg8c3BhbiBjbGFzcz0ianAiPumjn+OBuTwvc3Bhbj4pIHNpdHMgcmlnaHQgYmVmb3JlIDxzcGFuIGNsYXNzPSJqcCI+44G+44Gb44KTPC9zcGFuPi4=",
    "connect": "8J+UlyBDb21wYXJlIHdpdGggPHNwYW4gY2xhc3M9ImpwIj5+44G+44GX44KH44GGPC9zcGFuPiAoImxldCdzIGRvIiDigJQgZmlyc3QtcGVyc29uKSBhbmQgPHNwYW4gY2xhc3M9ImpwIj5+44G+44GX44KH44GG44GLPC9zcGFuPiAoInNoYWxsIEkvd2U/IiDigJQgY2hlY2tpbmcpLg==",
    "warn": null
  },
  {
    "lesson": 7,
    "type": "N5 · 文法1",
    "stem": "IkkgZ2F2ZSBNYXJpYSBmbG93ZXJzIjo8YnI+PHNwYW4gY2xhc3M9ImpwIj7jg57jg6rjgqLjgZXjgpM8c3BhbiBjbGFzcz0iYmxhbmsiPj88L3NwYW4+IDxydWJ5PuiKsTxydD7jga/jgao8L3J0PjwvcnVieT7jgpIg44GC44GS44G+44GX44Gf44CCPC9zcGFuPg==",
    "answer": "44Gr",
    "choices": [
      "に",
      "を",
      "へ",
      "で"
    ],
    "correctNote": "PHNwYW4gY2xhc3M9ImpwIj7jgas8L3NwYW4+IG1hcmtzIHRoZSBSRUNJUElFTlQg4oCUICJ0byBNYXJpYS4iIFBhdHRlcm46IDxzcGFuIGNsYXNzPSJqcCI+W3BlcnNvbl0g44GrIFt0aGluZ10g44KSIOOBguOBkuOBvuOBmTwvc3Bhbj4u",
    "explain": "Rm9yIGdpdmluZyB2ZXJicywgdGhlIHJlY2lwaWVudCB0YWtlcyDjgasuIFRoZSB0aGluZyBnaXZlbiB0YWtlcyDjgpIuIFR3byBwYXJ0aWNsZXMgc2hhcmUgdGhlIHNlbnRlbmNlLg==",
    "connect": "8J+UlyBUaGlzIOOBqyBmb3IgcmVjaXBpZW50IGFsc28gYXBwZWFycyB3aXRoIDxzcGFuIGNsYXNzPSJqcCI+44KC44KJ44GE44G+44GZPC9zcGFuPiwgPHNwYW4gY2xhc3M9ImpwIj48cnVieT7mlZk8cnQ+44GK44GXPC9ydD48L3J1Ynk+44GI44KLPC9zcGFuPiwgPHNwYW4gY2xhc3M9ImpwIj48cnVieT7osrg8cnQ+44GLPC9ydD48L3J1Ynk+44GZPC9zcGFuPiAoTDcpLCBhbmQgdGhlIGdpdmluZyBmYW1pbHkgPHNwYW4gY2xhc3M9ImpwIj7jgYLjgZLjgosv44GP44KM44KLL+OCguOCieOBhjwvc3Bhbj4gKEwyNCwgZXhwYW5kZWQgYWdhaW4gaW4gTjQgTDE4IGFuZCBBMiBMMTgpLg==",
    "warn": "4pqg77iPIFVzZSA8c3BhbiBjbGFzcz0ianAiPuOBj+OCjOOCizwvc3Bhbj4gbm90IDxzcGFuIGNsYXNzPSJqcCI+44GC44GS44KLPC9zcGFuPiB3aGVuIHNvbWVvbmUgZ2l2ZXMgVE8geW91IOKAlCB0aGF0J3MgdGhlIEwyNCB0cmFwLg=="
  },
  {
    "lesson": 7,
    "type": "N5 · 文法2 ★",
    "stem": "QnVpbGQgdGhlIHNlbnRlbmNlIGJ5IG9yZGVyaW5nIHRoZSA0IGZyYWdtZW50cy4gV2hpY2ggd29yZCBnb2VzIGluIHRoZSDimIUgcG9zaXRpb24/PGJyPjxicj48c3BhbiBjbGFzcz0ianAiPuOCj+OBn+OBl+OBryA8c3BhbiBjbGFzcz0iYmxhbmsiPuKRoDwvc3Bhbj4gPHNwYW4gY2xhc3M9ImJsYW5rIj7imIU8L3NwYW4+IDxzcGFuIGNsYXNzPSJibGFuayI+4pGiPC9zcGFuPiA8c3BhbiBjbGFzcz0iYmxhbmsiPuKRozwvc3Bhbj4gPHJ1Ynk+5pu4PHJ0PuOBizwvcnQ+PC9ydWJ5PuOBjeOBvuOBmeOAgjwvc3Bhbj48YnI+PGJyPldvcmQgYmFuazogPHNwYW4gY2xhc3M9ImpwIj48cnVieT7lkI3liY08cnQ+44Gq44G+44GIPC9ydD48L3J1Ynk+IMK3IOOCkiDCtyDjg5rjg7Mgwrcg44GnPC9zcGFuPg==",
    "answer": "44Gn",
    "choices": [
      "ペン",
      "で",
      "名前",
      "を"
    ],
    "correctNote": "4piFIHBvc2l0aW9uIChzbG90IDIpID0gPHNwYW4gY2xhc3M9ImpwIj7jgac8L3NwYW4+LiBCdWlsdDogPHNwYW4gY2xhc3M9ImpwIj7jgo/jgZ/jgZfjga8gPHN0cm9uZz7jg5rjg7Mg44GnIOWQjeWJjSDjgpI8L3N0cm9uZz4g5pu444GN44G+44GZ44CCPC9zcGFuPg==",
    "explain": "UGF0dGVybjogPHNwYW4gY2xhc3M9ImpwIj5bdG9vbF0g44GnIFtvYmplY3RdIOOCkiBWPC9zcGFuPi4gVGhlIOOBpy1waHJhc2UgKG1lYW5zL2luc3RydW1lbnQpIHByZWNlZGVzIHRoZSDjgpItcGhyYXNlIChkaXJlY3Qgb2JqZWN0KS4=",
    "connect": "8J+UlyBUaGUgc2FtZSDjgacgPSAidG9vbCIgYXBwZWFycyB3aXRoIDxzcGFuIGNsYXNzPSJqcCI+44Gv44GX44Gn6aOf44G544KLPC9zcGFuPiwgPHNwYW4gY2xhc3M9ImpwIj7jgYjjgpPjgbTjgaTjgafmm7jjgY88L3NwYW4+LCA8c3BhbiBjbGFzcz0ianAiPuaXpeacrOiqnuOBpzxydWJ5PuipsTxydD7jga/jgao8L3J0PjwvcnVieT7jgZk8L3NwYW4+Lg==",
    "warn": null
  },
  {
    "lesson": 8,
    "type": "N5 · 文法1",
    "stem": "IlRoaXMgcm9vbSBpcyBub3QgcXVpZXQiOjxicj48c3BhbiBjbGFzcz0ianAiPuOBk+OBriDjgbjjgoTjga8g44GX44Ga44GLPHNwYW4gY2xhc3M9ImJsYW5rIj4/PC9zcGFuPuOAgjwvc3Bhbj4=",
    "answer": "44GY44KDIOOBguOCiuOBvuOBm+OCkw==",
    "choices": [
      "じゃ ありません",
      "くないです",
      "じゃ ないです",
      "ありません"
    ],
    "correctNote": "PHNwYW4gY2xhc3M9ImpwIj7jgZfjgZrjgYs8L3NwYW4+IGlzIGEg44GqLWFkamVjdGl2ZS4gTmVnYXRlIOOBqi1hZGogbGlrZSBhIG5vdW46IDxzcGFuIGNsYXNzPSJqcCI+44GX44Ga44GLPHN0cm9uZz7jgZjjgoPjgYLjgorjgb7jgZvjgpM8L3N0cm9uZz48L3NwYW4+Lg==",
    "explain": "44GELWFkaiDihpIg44Cc44GP44Gq44GEICg8c3BhbiBjbGFzcz0ianAiPuWkp+OBjeOBhCDihpIg5aSn44GN44GP44Gq44GEPC9zcGFuPikuIOOBqi1hZGovTiDihpIgPHNwYW4gY2xhc3M9ImpwIj7jgZjjgoPjgYLjgorjgb7jgZvjgpM8L3NwYW4+ICg8c3BhbiBjbGFzcz0ianAiPuOBjeOCjOOBhCDihpIg44GN44KM44GE44GY44KD44GC44KK44G+44Gb44KTPC9zcGFuPiku",
    "connect": "8J+UlyBQYXN0IG5lZ2F0aXZlIGNvbWVzIGluIEwxMjog44GELWFkaiDihpIgPHNwYW4gY2xhc3M9ImpwIj5+44GP44Gq44GL44Gj44Gf44Gn44GZPC9zcGFuPjsg44GqLWFkai9OIOKGkiA8c3BhbiBjbGFzcz0ianAiPn7jgZjjgoPjgYLjgorjgb7jgZvjgpPjgafjgZfjgZ88L3NwYW4+Lg==",
    "warn": "4pqg77iPIDxzcGFuIGNsYXNzPSJqcCI+44GN44KM44GEPC9zcGFuPiBsb29rcyBsaWtlIGFuIOOBhC1hZGogYnV0IGlzIGEg44GqLWFkai4gPHNwYW4gY2xhc3M9ImpwIj7jgY3jgozjgY/jgarjgYQ8L3NwYW4+IOKclyDihpIgPHNwYW4gY2xhc3M9ImpwIj7jgY3jgozjgYTjgZjjgoPjgYLjgorjgb7jgZvjgpM8L3NwYW4+IOKcky4="
  },
  {
    "lesson": 9,
    "type": "N5 · 文法1",
    "stem": "IkkgdW5kZXJzdGFuZCBKYXBhbmVzZSI6PGJyPjxzcGFuIGNsYXNzPSJqcCI+44KP44Gf44GX44GvIDxydWJ5PuaXpeacrOiqnjxydD7jgavjgbvjgpPjgZQ8L3J0PjwvcnVieT48c3BhbiBjbGFzcz0iYmxhbmsiPj88L3NwYW4+IOOCj+OBi+OCiuOBvuOBmeOAgjwvc3Bhbj4=",
    "answer": "44GM",
    "choices": [
      "が",
      "を",
      "は",
      "に"
    ],
    "correctNote": "U3BlY2lhbCB2ZXJicyA8c3BhbiBjbGFzcz0ianAiPuOCj+OBi+OCi+ODu+OBguOCi+ODu+OBp+OBjeOCi+ODuzxydWJ5PuWlvTxydD7jgZk8L3J0PjwvcnVieT7jgY08L3NwYW4+IG1hcmsgdGhlaXIgb2JqZWN0IHdpdGgg44GMLCBOT1Qg44KSLg==",
    "explain": "VGhlc2UgZGVzY3JpYmUgYSBTVEFURSwgbm90IGFuIGFjdGlvbjogIkphcGFuZXNlIGlzIHVuZGVyc3RhbmRhYmxlIHRvIG1lLiIgSGVuY2Ug44GMIChzdWJqZWN0KSwgbm90IOOCkiAob2JqZWN0LWFjdGVkLW9uKS4=",
    "connect": "8J+UlyBUaGUgc2FtZSDjgYwtbWFya2VkLW9iamVjdCBhcHBlYXJzIGluIEwxMyAofuOBn+OBhDogPHNwYW4gY2xhc3M9ImpwIj7msLTjgYzpo7Ljgb/jgZ/jgYQ8L3NwYW4+KSBhbmQgTDE4ICg8c3BhbiBjbGFzcz0ianAiPn7jgZPjgajjgYzjgafjgY3jgos8L3NwYW4+KS4=",
    "warn": "4pqg77iPIDxzcGFuIGNsYXNzPSJqcCI+5pel5pys6Kqe44KSIOOCj+OBi+OCiuOBvuOBmTwvc3Bhbj4gaXMgdGhlIENMQVNTSUMgYmVnaW5uZXIgdHJhcCDigJQgc291bmRzIG5hdHVyYWwgYnV0IGlzIHdyb25nLg=="
  },
  {
    "lesson": 10,
    "type": "N5 · 文法1",
    "stem": "IlRoZXJlIGlzIGEgY2F0IGluIHRoZSBnYXJkZW4iOjxicj48c3BhbiBjbGFzcz0ianAiPuOBq+OCj+OBqyDjga3jgZPjgYwgPHNwYW4gY2xhc3M9ImJsYW5rIj4/PC9zcGFuPuOAgjwvc3Bhbj4=",
    "answer": "44GE44G+44GZ",
    "choices": [
      "います",
      "あります",
      "なります",
      "もちます"
    ],
    "correctNote": "Rm9yIExJVklORyBjcmVhdHVyZXMgKHBlb3BsZSwgYW5pbWFscyksIHVzZSA8c3BhbiBjbGFzcz0ianAiPuOBhOOBvuOBmTwvc3Bhbj4uIE5vbi1saXZpbmcgdGhpbmdzIHVzZSA8c3BhbiBjbGFzcz0ianAiPuOBguOCiuOBvuOBmTwvc3Bhbj4u",
    "explain": "Q2F0cywgZmlzaCwgaW5zZWN0cywgYmFiaWVzIOKGkiDjgYTjgb7jgZkuIEJvb2tzLCBjYXJzLCBwbGFudHMoISkg4oaSIOOBguOCiuOBvuOBmS4gUGxhbnRzIGNvdW50IGFzIG5vbi1saXZpbmcgZm9yIHRoaXMgdmVyYi4=",
    "connect": "8J+UlyBJbiBMMTMgeW91J2xsIG1lZXQgPHNwYW4gY2xhc3M9ImpwIj5bcGxhY2Vd44G4W2FjdGl2aXR5XeOBq+ihjOOBjzwvc3Bhbj4g4oCUIHB1cnBvc2Ug44GrLiBJbiBMMjEsIOOBguOCiuOBvuOBmSBnYWlucyBhIG5ldyBtZWFuaW5nOiAib2NjdXIvaGFwcGVuIiAoPHNwYW4gY2xhc3M9ImpwIj7jg5Hjg7zjg4bjgqPjg7zjgYzjgYLjgorjgb7jgZk8L3NwYW4+KS4=",
    "warn": null
  },
  {
    "lesson": 11,
    "type": "N5 · 文法2 ★",
    "stem": "QnVpbGQgdGhlIHNlbnRlbmNlIGJ5IG9yZGVyaW5nIHRoZSA0IGZyYWdtZW50cy4gV2hpY2ggd29yZCBnb2VzIGluIHRoZSDimIUgcG9zaXRpb24/PGJyPjxicj48c3BhbiBjbGFzcz0ianAiPuOBjeOBruOBhiA8c3BhbiBjbGFzcz0iYmxhbmsiPuKRoDwvc3Bhbj4gPHNwYW4gY2xhc3M9ImJsYW5rIj7ikaE8L3NwYW4+IDxzcGFuIGNsYXNzPSJibGFuayI+4piFPC9zcGFuPiA8c3BhbiBjbGFzcz0iYmxhbmsiPuKRozwvc3Bhbj4gPHJ1Ynk+6LK3PHJ0PuOBizwvcnQ+PC9ydWJ5PuOBhOOBvuOBl+OBn+OAgjwvc3Bhbj48YnI+PGJyPldvcmQgYmFuazogPHNwYW4gY2xhc3M9ImpwIj48cnVieT7kuInlhoo8cnQ+44GV44KT44GV44GkPC9ydD48L3J1Ynk+IMK3IDxydWJ5PuacrDxydD7jgbvjgpM8L3J0PjwvcnVieT4gwrcgPHJ1Ynk+5pys5bGLPHJ0PuOBu+OCk+OChDwvcnQ+PC9ydWJ5PuOBpyDCtyDjgpI8L3NwYW4+",
    "answer": "44KS",
    "choices": [
      "本屋で",
      "本",
      "を",
      "三冊"
    ],
    "correctNote": "4piFIHBvc2l0aW9uIChzbG90IDMpID0gPHNwYW4gY2xhc3M9ImpwIj7jgpI8L3NwYW4+LiBCdWlsdDogPHNwYW4gY2xhc3M9ImpwIj7jgY3jga7jgYYgPHN0cm9uZz7mnKzlsYvjgacg5pysIOOCkiDkuInlhoo8L3N0cm9uZz4g6LK344GE44G+44GX44Gf44CCPC9zcGFuPg==",
    "explain": "TDExIHF1YW50aWZpZXIgcnVsZTogY291bnRlciBnb2VzIFJJR0hUIEJFRk9SRSB0aGUgdmVyYiwgQUZURVIgdGhlIOOCki1waHJhc2Ug4oCUIE5PVCBpbnNpZGUgdGhlIG5vdW4gcGhyYXNlLiBPcmRlcjogPHNwYW4gY2xhc3M9ImpwIj5bcGxhY2Vd44GnIFtvYmplY3Rd44KSIFtjb3VudGVyXSBWPC9zcGFuPi4=",
    "connect": "8J+UlyBQb3NpdGlvbiBzd2FwIGlzIHRoZSBMMTEgaGFyZCBwYXJ0OiA8c3BhbiBjbGFzcz0ianAiPuacrOOCkiDkuInlhoog6LK344GGPC9zcGFuPiDinJMgKG5hdHVyYWwpIHZzIDxzcGFuIGNsYXNzPSJqcCI+5LiJ5YaK44Gu5pys44KS6LK344GGPC9zcGFuPiAoYm9va2lzaCku",
    "warn": "4pqg77iPIENvdW50ZXJzIE1VU1QgbWF0Y2ggdGhlIG5vdW46IOOAnDxydWJ5PuWGijxydD7jgZXjgaQ8L3J0PjwvcnVieT4gKGJvb2tzKSwg44CcPHJ1Ynk+5pysPHJ0PuOBu+OCkzwvcnQ+PC9ydWJ5PiAobG9uZyB0aGluZ3MpLCDjgJzjgb7jgYQgKGZsYXQgdGhpbmdzKSwg44CcPHJ1Ynk+5Lq6PHJ0PuOBq+OCkzwvcnQ+PC9ydWJ5PiAocGVvcGxlKS4="
  },
  {
    "lesson": 12,
    "type": "N5 · 文法1",
    "stem": "IlRva3lvIGlzIGJpZ2dlciB0aGFuIE9zYWthIjo8YnI+PHNwYW4gY2xhc3M9ImpwIj48cnVieT7mnbHkuqw8cnQ+44Go44GG44GN44KH44GGPC9ydD48L3J1Ynk+44GvIDxydWJ5PuWkp+mYqjxydD7jgYrjgYrjgZXjgYs8L3J0PjwvcnVieT48c3BhbiBjbGFzcz0iYmxhbmsiPj88L3NwYW4+IOWkp+OBjeOBhOOBp+OBmeOAgjwvc3Bhbj4=",
    "answer": "44KI44KK",
    "choices": [
      "より",
      "から",
      "ほど",
      "まで"
    ],
    "correctNote": "PHNwYW4gY2xhc3M9ImpwIj5BIOOBryBCIOOCiOOCiiBhZGog44Gn44GZPC9zcGFuPiA9ICJBIGlzIG1vcmUgYWRqIHRoYW4gQi4iIOOCiOOCiiA9ICJ0aGFuLiI=",
    "explain": "VGhlIG1hdGNoaW5nIHF1ZXN0aW9uIGlzIDxzcGFuIGNsYXNzPSJqcCI+QSDjgaggQiDjgagg44Gp44Gh44KJ44GMIGFkaiDjgafjgZnjgYs8L3NwYW4+LiBBbnN3ZXIgd2l0aCA8c3BhbiBjbGFzcz0ianAiPkEg44GuIOOBu+OBhuOBjCBhZGog44Gn44GZPC9zcGFuPi4=",
    "connect": "8J+UlyBUaGUgTDEyIOavlOi8gyB0cmlvOiDjgojjgoogKHRoYW4pICsg44G744GG44GMIChtb3JlKSArIOOBhOOBoeOBsOOCkyAobW9zdCkuIEZvciBzdXBlcmxhdGl2ZXMgdXNlIDxzcGFuIGNsYXNzPSJqcCI+W2dyb3VwXeOBrjxydWJ5PuS4rTxydD7jgarjgYs8L3J0PjwvcnVieT7jgadOIOOBjOOBhOOBoeOBsOOCk2Fkajwvc3Bhbj4u",
    "warn": "4pqg77iPIDxzcGFuIGNsYXNzPSJqcCI+44KI44KKPC9zcGFuPiBuZXZlciBzd2FwcyB3aXRoIDxzcGFuIGNsYXNzPSJqcCI+44GL44KJPC9zcGFuPiBoZXJlIOKAlCDjgYvjgokgbWVhbnMgImZyb20uIg=="
  },
  {
    "lesson": 13,
    "type": "N5 · 文法2 ★",
    "stem": "QnVpbGQgdGhlIHNlbnRlbmNlIGJ5IG9yZGVyaW5nIHRoZSA0IGZyYWdtZW50cy4gV2hpY2ggd29yZCBnb2VzIGluIHRoZSDimIUgcG9zaXRpb24/PGJyPjxicj48c3BhbiBjbGFzcz0ianAiPuOCj+OBn+OBl+OBryA8c3BhbiBjbGFzcz0iYmxhbmsiPuKRoDwvc3Bhbj4gPHNwYW4gY2xhc3M9ImJsYW5rIj7ikaE8L3NwYW4+IDxzcGFuIGNsYXNzPSJibGFuayI+4pGiPC9zcGFuPiA8c3BhbiBjbGFzcz0iYmxhbmsiPuKYhTwvc3Bhbj4g44Gn44GZ44CCPC9zcGFuPjxicj48YnI+V29yZCBiYW5rOiA8c3BhbiBjbGFzcz0ianAiPuOBjCDCtyA8cnVieT7mnInlkI08cnQ+44KG44GG44KB44GEPC9ydD48L3J1Ynk+44GqIMK3IDxydWJ5PumjsjxydD7jga48L3J0PjwvcnVieT7jgb/jgZ/jgYQgwrcg44Kz44O844OS44O8PC9zcGFuPg==",
    "answer": "6aOy44G/44Gf44GE",
    "choices": [
      "有名な",
      "コーヒー",
      "が",
      "飲みたい"
    ],
    "correctNote": "4piFIHBvc2l0aW9uIChzbG90IDQpID0gPHNwYW4gY2xhc3M9ImpwIj7po7Ljgb/jgZ/jgYQ8L3NwYW4+LiBCdWlsdDogPHNwYW4gY2xhc3M9ImpwIj7jgo/jgZ/jgZfjga8gPHN0cm9uZz7mnInlkI3jgaog44Kz44O844OS44O8IOOBjCDpo7Ljgb/jgZ/jgYQ8L3N0cm9uZz4g44Gn44GZ44CCPC9zcGFuPg==",
    "explain": "V2l0aCA8c3BhbiBjbGFzcz0ianAiPn7jgZ/jgYQ8L3NwYW4+LCB0aGUgZGVzaXJlZCBvYmplY3QgaXMgb2Z0ZW4gbWFya2VkIHdpdGgg44GMIChlbXBoYXNpemluZyBkZXNpcmUpLiA8c3BhbiBjbGFzcz0ianAiPlthZGpdIE4g44GMIFYt44Gf44GEPC9zcGFuPiBpcyBhIHN0YW5kYXJkIHBhdHRlcm4gZm9yIGV4cHJlc3Npbmcgd2FudHMu",
    "connect": "8J+UlyB+44Gf44GEIGNvbmp1Z2F0ZXMgbGlrZSBhbiDjgYQtYWRqZWN0aXZlOiA8c3BhbiBjbGFzcz0ianAiPumjsuOBv+OBn+OBj+OBquOBhOOAgemjsuOBv+OBn+OBi+OBo+OBnzwvc3Bhbj4u",
    "warn": "4pqg77iPIDxzcGFuIGNsYXNzPSJqcCI+fuOBn+OBhDwvc3Bhbj4gaXMgZm9yIFlPVVJTRUxGIG9yIGFza2luZyB0aGUgbGlzdGVuZXIuIEZvciAzcmQtcGVyc29uIGRlc2lyZXMgeW91IG5lZWQgPHNwYW4gY2xhc3M9ImpwIj5+44Gf44GM44KLPC9zcGFuPi4="
  },
  {
    "lesson": 14,
    "type": "N5 · 文法1",
    "stem": "IlBsZWFzZSBvcGVuIHRoZSB3aW5kb3ciOjxicj48c3BhbiBjbGFzcz0ianAiPuOBvuOBqeOCkiA8c3BhbiBjbGFzcz0iYmxhbmsiPj88L3NwYW4+IOOBj+OBoOOBleOBhOOAgjwvc3Bhbj4=",
    "answer": "44GC44GR44Gm",
    "choices": [
      "あけて",
      "あけって",
      "あいて",
      "あけた"
    ],
    "correctNote": "PHNwYW4gY2xhc3M9ImpwIj7jgYLjgZHjgb7jgZk8L3NwYW4+IChHMikg4oaSIHRlLWZvcm0gaXMgPHNwYW4gY2xhc3M9ImpwIj7jgYLjgZHjgaY8L3NwYW4+LiBQYXR0ZXJuOiA8c3BhbiBjbGFzcz0ianAiPlYg44GmIOOBj+OBoOOBleOBhDwvc3Bhbj4u",
    "explain": "RzIgKHZvd2VsLXN0ZW0pIHZlcmJzIGRyb3Ag44G+44GZIGFuZCBhZGQg44GmLiBHMSAoY29uc29uYW50LXN0ZW0pIGZvbGxvdyB0aGUg44GE44O744Gh44O744KK4oaS44Gj44GmIC8g44G/44O744Gz44O744Gr4oaS44KT44GnIC8g44GN4oaS44GE44GmIC8g44GO4oaS44GE44GnIC8g44GX4oaS44GX44GmIHNvbmcu",
    "connect": "8J+UlyBUaGUg44GmLWZvcm0gdW5sb2NrcyBMMTQgKH7jgabjgY/jgaDjgZXjgYTjgIF+44Gm44GE44G+44GZKSwgTDE1ICh+44Gm44KC44GE44GE44CBfuOBpuOBr+OBhOOBkeOBquOBhCksIEwxNiAofuOBpuOBi+OCieOAgWxpbmtpbmcpLCBMMjQgKH7jgabjgY/jgozjgosv44KC44KJ44GGL+OBguOBkuOCiyksIEwyNSAofuOBpuOCgiksIGFuZCBiZXlvbmQu",
    "warn": "4pqg77iPIDxzcGFuIGNsYXNzPSJqcCI+44GC44GE44GmPC9zcGFuPiB3b3VsZCBiZSBmcm9tIDxzcGFuIGNsYXNzPSJqcCI+44GC44GE44G+44GZPC9zcGFuPiAodG8gbWVldCkg4oCUIHRvdGFsbHkgZGlmZmVyZW50IHZlcmIh"
  },
  {
    "lesson": 15,
    "type": "N5 · 文法1",
    "stem": "Ik1heSBJIHRha2UgYSBwaG90byBoZXJlPyI6PGJyPjxzcGFuIGNsYXNzPSJqcCI+44GT44GT44GnIOOBl+OCg+OBl+OCk+OCkiA8c3BhbiBjbGFzcz0iYmxhbmsiPj88L3NwYW4+IOOBhOOBhOOBp+OBmeOBi+OAgjwvc3Bhbj4=",
    "answer": "44Go44Gj44Gm44KC",
    "choices": [
      "とっても",
      "とるも",
      "とります",
      "とりても"
    ],
    "correctNote": "PHNwYW4gY2xhc3M9ImpwIj7jgajjgorjgb7jgZkg4oaSIOOBqOOBo+OBpiDihpIg44Go44Gj44Gm44KC44GE44GE44Gn44GZ44GLPC9zcGFuPiA9ICJJcyBpdCBPSyBpZiBJIHRha2UgYSBwaG90bz8i",
    "explain": "UGF0dGVybjogPHNwYW4gY2xhc3M9ImpwIj5WIOOBpiArIOOCgiDjgYTjgYTjgafjgZnjgYs8L3NwYW4+LiBQZXJtaXNzaW9uLiBPcHBvc2l0ZSAocHJvaGliaXRpb24pOiA8c3BhbiBjbGFzcz0ianAiPlYg44Gm44GvIOOBhOOBkeOBvuOBm+OCkzwvc3Bhbj4u",
    "connect": "8J+UlyBJbiBMMTcgdGhlIG9ibGlnYXRpb24gc3lzdGVtIGNvbXBsZXRlczogPHNwYW4gY2xhc3M9ImpwIj5+44Gq44GR44KM44Gw44Gq44KK44G+44Gb44KTPC9zcGFuPiAobXVzdCkgYW5kIDxzcGFuIGNsYXNzPSJqcCI+fuOBquOBj+OBpuOCguOBhOOBhOOBp+OBmTwvc3Bhbj4gKGRvbid0IGhhdmUgdG8pLg==",
    "warn": "4pqg77iPIFRoZSBHMSDjgaYtZm9ybSBydWxlOiDjgosg4oaSIOOBo+OBpiAo44Go44KL4oaS44Go44Gj44Gm44CB44GL44GI44KL4oaS44GL44GI44Gj44GmKS4="
  },
  {
    "lesson": 16,
    "type": "N5 · 文法2 ★",
    "stem": "QnVpbGQgdGhlIHNlbnRlbmNlIGJ5IG9yZGVyaW5nIHRoZSA0IGZyYWdtZW50cy4gV2hpY2ggd29yZCBnb2VzIGluIHRoZSDimIUgcG9zaXRpb24/PGJyPjxicj48c3BhbiBjbGFzcz0ianAiPjxydWJ5PuavjuacnTxydD7jgb7jgYTjgYLjgZU8L3J0PjwvcnVieT4gPHNwYW4gY2xhc3M9ImJsYW5rIj7ikaA8L3NwYW4+IDxzcGFuIGNsYXNzPSJibGFuayI+4pGhPC9zcGFuPiA8c3BhbiBjbGFzcz0iYmxhbmsiPuKYhTwvc3Bhbj4gPHNwYW4gY2xhc3M9ImJsYW5rIj7ikaM8L3NwYW4+IDxydWJ5PuWHujxydD7jgac8L3J0PjwvcnVieT7jgYvjgZHjgb7jgZnjgII8L3NwYW4+PGJyPjxicj5Xb3JkIGJhbms6IDxzcGFuIGNsYXNzPSJqcCI+44GL44KJIMK3IOOCkiDCtyDjgZTjga/jgpMgwrcgPHJ1Ynk+6aOfPHJ0PuOBnzwvcnQ+PC9ydWJ5PuOBueOBpjwvc3Bhbj4=",
    "answer": "6aOf44G544Gm",
    "choices": [
      "ごはん",
      "を",
      "食べて",
      "から"
    ],
    "correctNote": "4piFIHBvc2l0aW9uIChzbG90IDMpID0gPHNwYW4gY2xhc3M9ImpwIj7po5/jgbnjgaY8L3NwYW4+LiBCdWlsdDogPHNwYW4gY2xhc3M9ImpwIj7mr47mnJ0gPHN0cm9uZz7jgZTjga/jgpMg44KSIOmjn+OBueOBpiDjgYvjgok8L3N0cm9uZz4g5Ye644GL44GR44G+44GZ44CCPC9zcGFuPg==",
    "explain": "PHNwYW4gY2xhc3M9ImpwIj5W4oKBIOOBpuOBi+OCiSBW4oKCPC9zcGFuPiBlbXBoYXNpemVzICJGSVJTVCBW4oKBLCBUSEVOIFbigoIuIiBUaGUg44GmLWZvcm0gc2l0cyByaWdodCBiZWZvcmUg44GL44KJLg==",
    "connect": "8J+UlyBDb21wYXJlIHdpdGggTDE4IDxzcGFuIGNsYXNzPSJqcCI+fuOBvuOBiOOBq348L3NwYW4+ICgiYmVmb3JlIGRvaW5nIik6IG1pcnJvciBpbWFnZSBvZiDjgabjgYvjgoku",
    "warn": null
  },
  {
    "lesson": 17,
    "type": "N5 · 文法1",
    "stem": "IkkgaGF2ZSB0byBzdHVkeSB0b21vcnJvdyI6PGJyPjxzcGFuIGNsYXNzPSJqcCI+44GC44GX44GfIDxydWJ5PuWLieW8tzxydD7jgbnjgpPjgY3jgofjgYY8L3J0PjwvcnVieT4gPHNwYW4gY2xhc3M9ImJsYW5rIj4/PC9zcGFuPuOAgjwvc3Bhbj4=",
    "answer": "44GX44Gq44GR44KM44Gw44Gq44KK44G+44Gb44KT",
    "choices": [
      "しなければなりません",
      "しないでください",
      "しなくてもいいです",
      "しても いいです"
    ],
    "correctNote": "PHNwYW4gY2xhc3M9ImpwIj5+44Gq44GR44KM44Gw44Gq44KK44G+44Gb44KTPC9zcGFuPiA9ICJtdXN0IC8gaGF2ZSB0byBkby4iIEJ1aWx0IGZyb20gdGhlIOOBquOBhC1mb3JtOiA8c3BhbiBjbGFzcz0ianAiPuOBl+OBquOBhCDihpIg44GX44Gq44GR44KM44GwICsg44Gq44KK44G+44Gb44KTPC9zcGFuPi4=",
    "explain": "TDE3IG9ibGlnYXRpb24gdHJpbzogPHNwYW4gY2xhc3M9ImpwIj5+44Gq44GR44KM44Gw44Gq44KK44G+44Gb44KTPC9zcGFuPiAobXVzdCksIDxzcGFuIGNsYXNzPSJqcCI+fuOBquOBj+OBpuOCguOBhOOBhOOBp+OBmTwvc3Bhbj4gKGRvbid0IGhhdmUgdG8pLCA8c3BhbiBjbGFzcz0ianAiPn7jgarjgYTjgafjgY/jgaDjgZXjgYQ8L3NwYW4+IChwbGVhc2UgZG9uJ3QpLg==",
    "connect": "8J+UlyBJbiBjYXN1YWwgc3BlZWNoOiA8c3BhbiBjbGFzcz0ianAiPn7jgarjgY3jgoM8L3NwYW4+IG9yIDxzcGFuIGNsYXNzPSJqcCI+fuOBquOBhOOBqDwvc3Bhbj4gKEwyMSBONTsgQTIgTDEwKS4=",
    "warn": "4pqg77iPIFRoZSDjgarjgYQtZm9ybSBkaWZmZXJzIGZyb20gbmVnYXRpdmUg44G+44GZLWZvcm0uIEcxIHZlcmJzIHNoaWZ0IOOBhuKGkuOBgjogPHNwYW4gY2xhc3M9ImpwIj7jgYvjgYYg4oaSIOOBi+OCj+OBquOBhDwvc3Bhbj4u"
  },
  {
    "lesson": 18,
    "type": "N5 · 文法1",
    "stem": "Ik1yLiBNaXJhIGNhbiBwbGF5IHRoZSBwaWFubyI6PGJyPjxzcGFuIGNsYXNzPSJqcCI+44Of44Op44O844GV44KT44GvIOODlOOCouODjuOCkiDjgbLjgY8gPHNwYW4gY2xhc3M9ImJsYW5rIj4/PC9zcGFuPiDjgafjgY3jgb7jgZnjgII8L3NwYW4+",
    "answer": "44GT44Go44GM",
    "choices": [
      "ことが",
      "ことを",
      "のが",
      "のを"
    ],
    "correctNote": "PHNwYW4gY2xhc3M9ImpwIj5WLTxydWJ5Pui+nuabuOW9ojxydD7jgZjjgZfjgofjgZHjgYQ8L3J0PjwvcnVieT4gKyDjgZPjgajjgYwg44Gn44GN44G+44GZPC9zcGFuPiA9ICJjYW4gZG8gVi4i",
    "explain": "PHNwYW4gY2xhc3M9ImpwIj7jgZPjgag8L3NwYW4+IG5vbWluYWxpemVzIHRoZSB2ZXJiLiBMaXRlcmFsbHk6ICJ0aGUgYWN0IG9mIHBsYXlpbmcgcGlhbm8gaXMgcG9zc2libGUuIg==",
    "connect": "8J+UlyDjgZPjgaggYXBwZWFycyBhZ2FpbiBpbiBMMTkgKDxzcGFuIGNsYXNzPSJqcCI+Vi3jgZ8g44GT44Go44GMIOOBguOCizwvc3Bhbj4gPSBwYXN0IGV4cGVyaWVuY2UpLiBJbiBBMiBMNSB0aGlzIGdldHMgcmVwbGFjZWQgYnkgdGhlIGNsZWFuZXIgcG90ZW50aWFsIGZvcm06IDxzcGFuIGNsYXNzPSJqcCI+44Gy44GR44KLPC9zcGFuPi4=",
    "warn": "4pqg77iPIERvbid0IG1peCB1cCA8c3BhbiBjbGFzcz0ianAiPlYt44GfIOOBk+OBqOOBjCDjgYLjgos8L3NwYW4+IChMMTksIGV4cGVyaWVuY2UpIHdpdGggPHNwYW4gY2xhc3M9ImpwIj5WLei+nuabuCDjgZPjgajjgYwg44Gn44GN44KLPC9zcGFuPiAoTDE4LCBhYmlsaXR5KSDigJQgdGhlIHZlcmIgZm9ybSBjaGFuZ2VzIHRoZSBtZWFuaW5nIQ=="
  },
  {
    "lesson": 19,
    "type": "N5 · 文法2 ★",
    "stem": "QnVpbGQgdGhlIHNlbnRlbmNlIGJ5IG9yZGVyaW5nIHRoZSA0IGZyYWdtZW50cy4gV2hpY2ggd29yZCBnb2VzIGluIHRoZSDimIUgcG9zaXRpb24/PGJyPjxicj48c3BhbiBjbGFzcz0ianAiPuOCj+OBn+OBl+OBryA8c3BhbiBjbGFzcz0iYmxhbmsiPuKRoDwvc3Bhbj4gPHNwYW4gY2xhc3M9ImJsYW5rIj7ikaE8L3NwYW4+IDxzcGFuIGNsYXNzPSJibGFuayI+4pGiPC9zcGFuPiA8c3BhbiBjbGFzcz0iYmxhbmsiPuKYhTwvc3Bhbj4g44GC44KK44G+44GZ44CCPC9zcGFuPjxicj48YnI+V29yZCBiYW5rOiA8c3BhbiBjbGFzcz0ianAiPjxydWJ5PumjnzxydD7jgZ88L3J0PjwvcnVieT7jgbnjgZ8gwrcg44GT44Go44GMIMK3IDxydWJ5PuaXpeacrDxydD7jgavjgbvjgpM8L3J0PjwvcnVieT7jgacgwrcgPHJ1Ynk+5a+/5Y+4PHJ0PuOBmeOBlzwvcnQ+PC9ydWJ5PuOCkjwvc3Bhbj4=",
    "answer": "44GT44Go44GM",
    "choices": [
      "日本で",
      "寿司を",
      "食べた",
      "ことが"
    ],
    "correctNote": "4piFIHBvc2l0aW9uIChzbG90IDQpID0gPHNwYW4gY2xhc3M9ImpwIj7jgZPjgajjgYw8L3NwYW4+LiBCdWlsdDogPHNwYW4gY2xhc3M9ImpwIj7jgo/jgZ/jgZfjga8gPHN0cm9uZz7ml6XmnKzjgacg5a+/5Y+444KSIOmjn+OBueOBnyDjgZPjgajjgYw8L3N0cm9uZz4g44GC44KK44G+44GZ44CCPC9zcGFuPg==",
    "explain": "PHNwYW4gY2xhc3M9ImpwIj5WLeOBnyDjgZPjgajjgYwg44GC44KK44G+44GZPC9zcGFuPiA9IHBhc3QgZXhwZXJpZW5jZS4gT3JkZXI6IFt3aGVyZV1bd2hhdF0gW1Yt44GfXSBb44GT44Go44GMXSDjgYLjgorjgb7jgZkuIOOBk+OBqOOBjCBhbHdheXMgc2l0cyByaWdodCBiZWZvcmUg44GC44KK44G+44GZLg==",
    "connect": "8J+UlyBNaXJyb3IgdHJhcCB3aXRoIEwxODogc2FtZSDjgZPjgagsIGRpZmZlcmVudCB2ZXJiIGZvcm0sIGRpZmZlcmVudCBtZWFuaW5nISA8c3BhbiBjbGFzcz0ianAiPlYt6L6e5pu4IOOBk+OBqOOBjOOBp+OBjeOCizwvc3Bhbj4gPSBhYmlsaXR5IHZzIDxzcGFuIGNsYXNzPSJqcCI+Vi3jgZ8g44GT44Go44GM44GC44KLPC9zcGFuPiA9IGV4cGVyaWVuY2Uu",
    "warn": "4pqg77iPIEFsd2F5cyBWLeOBnywgbmV2ZXIgVi3jgb7jgZkuIDxzcGFuIGNsYXNzPSJqcCI+6aOf44G544G+44GX44GfIOOBk+OBqOOBjCDjgYLjgorjgb7jgZk8L3NwYW4+IOKcly4="
  },
  {
    "lesson": 20,
    "type": "N5 · 文法1",
    "stem": "UGxhaW4gKGNhc3VhbCkgZm9ybSBvZiA8c3BhbiBjbGFzcz0ianAiPjxydWJ5PumjnzxydD7jgZ88L3J0PjwvcnVieT7jgbnjgb7jgZvjgpM8L3NwYW4+Og==",
    "answer": "6aOf44G544Gq44GE",
    "choices": [
      "食べない",
      "食べる",
      "食べた",
      "食べなかった"
    ],
    "correctNote": "PHNwYW4gY2xhc3M9ImpwIj7po5/jgbnjgb7jgZvjgpM8L3NwYW4+IChwb2xpdGUgbmVnYXRpdmUpIOKGkiA8c3BhbiBjbGFzcz0ianAiPumjn+OBueOBquOBhDwvc3Bhbj4gKHBsYWluIG5lZ2F0aXZlKS4=",
    "explain": "TDIwIHBsYWluIGZvcm1zOiA8c3BhbiBjbGFzcz0ianAiPjxydWJ5Pui+nuabuDxydD7jgZjjgZfjgoc8L3J0PjwvcnVieT48cnVieT7lvaI8cnQ+44GR44GEPC9ydD48L3J1Ynk+PC9zcGFuPiAoZWF0KSwgPHNwYW4gY2xhc3M9ImpwIj5+44Gq44GEPC9zcGFuPiAoZG9uJ3QgZWF0KSwgPHNwYW4gY2xhc3M9ImpwIj5+44GfPC9zcGFuPiAoYXRlKSwgPHNwYW4gY2xhc3M9ImpwIj5+44Gq44GL44Gj44GfPC9zcGFuPiAoZGlkbid0IGVhdCku",
    "connect": "8J+UlyBQbGFpbiBmb3JtcyB1bmxvY2sgZXZlcnl0aGluZzogPHNwYW4gY2xhc3M9ImpwIj5+44Go44GNPC9zcGFuPiAoTDIzKSwgPHNwYW4gY2xhc3M9ImpwIj5+44Gf44KJPC9zcGFuPiAoTDI1KSwgPHNwYW4gY2xhc3M9ImpwIj5+44Gn44GX44KH44GGPC9zcGFuPiAoTDIxKSwgbm91biBtb2RpZmljYXRpb24gKEwyMiku",
    "warn": "4pqg77iPIFBsYWluIGZvcm0gaXMgZ3JhbW1hdGljYWxseSBlc3NlbnRpYWwgYnV0IHNvY2lhbGx5IFJJU0tZIOKAlCBvbmx5IHVzZSB3aXRoIGNsb3NlIGZyaWVuZHMsIGZhbWlseSwgb3IgaW4gd3JpdGluZy4="
  },
  {
    "lesson": 21,
    "type": "N5 · 文法1",
    "stem": "Ikl0IHdpbGwgcHJvYmFibHkgcmFpbiB0b21vcnJvdyI6PGJyPjxzcGFuIGNsYXNzPSJqcCI+44GC44GX44GfIDxydWJ5PumbqDxydD7jgYLjgoE8L3J0PjwvcnVieT7jgYwg44G144KLIDxzcGFuIGNsYXNzPSJibGFuayI+Pzwvc3Bhbj7jgII8L3NwYW4+",
    "answer": "44Gn44GX44KH44GG",
    "choices": [
      "でしょう",
      "ます",
      "です",
      "ました"
    ],
    "correctNote": "PHNwYW4gY2xhc3M9ImpwIj5bcGxhaW4gZm9ybV0gKyDjgafjgZfjgofjgYY8L3NwYW4+ID0gInByb2JhYmx5IC8gSSB0aGluay4iIEEgc3BlYWtlcidzIHByZWRpY3Rpb24u",
    "explain": "UHJvbm91bmNlZCB3aXRoIEZBTExJTkcgdG9uZSBmb3IgInByb2JhYmx5LiIgV2l0aCBSSVNJTkcgdG9uZSAofuOBp+OBl+OCh+OBhj8pLCBpdCBhc2tzIGZvciBjb25maXJtYXRpb246ICJyaWdodD8i",
    "connect": "8J+UlyBDb21wYXJlIHdpdGggc3Ryb25nZXIgPHNwYW4gY2xhc3M9ImpwIj5+44Go44GK44KC44GE44G+44GZPC9zcGFuPiAoTDIxKSBhbmQgdGhlIGhlYXJzYXkgPHNwYW4gY2xhc3M9ImpwIj5+44Gd44GG44Gn44GZPC9zcGFuPiAoTjQgTDE4KS4g44Gn44GX44KH44GGIGlzIHRoZSBnZW50bGVzdCAicHJvYmFibHkuIg==",
    "warn": "4pqg77iPIFdpdGggbm91bnMv44GqLWFkaiwgZHJvcCB0aGUg44GgOiA8c3BhbiBjbGFzcz0ianAiPuOBguOBl+OBnyDpm6jjgafjgZfjgofjgYY8L3NwYW4+IOKAlCBOT1QgPHNwYW4gY2xhc3M9ImpwIj7pm6jjgaDjgafjgZfjgofjgYY8L3NwYW4+Lg=="
  },
  {
    "lesson": 22,
    "type": "N5 · 文法2 ★",
    "stem": "QnVpbGQgdGhlIHNlbnRlbmNlIGJ5IG9yZGVyaW5nIHRoZSA0IGZyYWdtZW50cy4gV2hpY2ggd29yZCBnb2VzIGluIHRoZSDimIUgcG9zaXRpb24/PGJyPjxicj48c3BhbiBjbGFzcz0ianAiPuOBk+OCjOOBryA8c3BhbiBjbGFzcz0iYmxhbmsiPuKRoDwvc3Bhbj4gPHNwYW4gY2xhc3M9ImJsYW5rIj7imIU8L3NwYW4+IDxzcGFuIGNsYXNzPSJibGFuayI+4pGiPC9zcGFuPiA8c3BhbiBjbGFzcz0iYmxhbmsiPuKRozwvc3Bhbj4g44Gn44GZ44CCPC9zcGFuPjxicj48YnI+V29yZCBiYW5rOiA8c3BhbiBjbGFzcz0ianAiPuOBi+OBsOOCkyDCtyDjgYwgwrcgPHJ1Ynk+54i2PHJ0PuOBoeOBoTwvcnQ+PC9ydWJ5PiDCtyDjgY/jgozjgZ88L3NwYW4+",
    "answer": "44GM",
    "choices": [
      "父",
      "が",
      "くれた",
      "かばん"
    ],
    "correctNote": "4piFIHBvc2l0aW9uIChzbG90IDIpID0gPHNwYW4gY2xhc3M9ImpwIj7jgYw8L3NwYW4+LiBCdWlsdDogPHNwYW4gY2xhc3M9ImpwIj7jgZPjgozjga8gPHN0cm9uZz7niLYg44GMIOOBj+OCjOOBnyDjgYvjgbDjgpM8L3N0cm9uZz4g44Gn44GZ44CCPC9zcGFuPg==",
    "explain": "TDIyIG5vdW4gbW9kaWZpY2F0aW9uOiBhIHZlcmItY2xhdXNlIGRpcmVjdGx5IG1vZGlmaWVzIGEgbm91bi4gSW5zaWRlIHRoZSBtb2RpZnlpbmcgY2xhdXNlLCB0aGUgc3ViamVjdCBpcyBtYXJrZWQgd2l0aCDjgYwgKE5PVCDjga8pLiA8c3BhbiBjbGFzcz0ianAiPlvniLbjgYzjgY/jgozjgZ9dIOOBi+OBsOOCkzwvc3Bhbj4gPSAidGhlIGJhZyBmYXRoZXIgZ2F2ZS4i",
    "connect": "8J+UlyBUb3BpYyDjga8gYWx3YXlzIGVzY2FwZXMgdGhlIHJlbGF0aXZlIGNsYXVzZSBhbmQgc3RheXMgYXR0YWNoZWQgdG8gdGhlIG1haW4gc3ViamVjdCAo44GT44KM44GvKS4gSW5zaWRlIFsuLi5dJ3MgdGhlIGVtYmVkZGVkIHN1YmplY3QgdGFrZXMg44GMLg==",
    "warn": "4pqg77iPIE9uZSBvZiB0aGUgQklHR0VTVCBqdW1wcyBmcm9tIEVuZ2xpc2guIEphcGFuZXNlIHB1dHMgdGhlIG1vZGlmaWVyIEJFRk9SRSB0aGUgbm91biwgd2l0aCBubyAidGhhdC93aGljaCIgYmV0d2VlbiB0aGVtLg=="
  },
  {
    "lesson": 23,
    "type": "N5 · 文法1",
    "stem": "IldoZW4gSSB3ZW50IHRvIEphcGFuLCBJIGJvdWdodCBhIGtpbW9ubyI6PGJyPjxzcGFuIGNsYXNzPSJqcCI+PHJ1Ynk+5pel5pysPHJ0PuOBq+OBu+OCkzwvcnQ+PC9ydWJ5PuOBqyA8c3BhbiBjbGFzcz0iYmxhbmsiPj88L3NwYW4+IOOBqOOBjeOAgSDjgY3jgoLjga7jgpIgPHJ1Ynk+6LK3PHJ0PuOBizwvcnQ+PC9ydWJ5PuOBhOOBvuOBl+OBn+OAgjwvc3Bhbj4=",
    "answer": "6KGM44Gj44Gf",
    "choices": [
      "行った",
      "行く",
      "行って",
      "行きました"
    ],
    "correctNote": "V2hlbiB0aGUgYWN0aW9uIGlzIENPTVBMRVRFRCBiZWZvcmUgdGhlIG1haW4gY2xhdXNlLCB1c2UgPHNwYW4gY2xhc3M9ImpwIj5WLeOBnyArIOOBqOOBjTwvc3Bhbj4uIDxzcGFuIGNsYXNzPSJqcCI+6KGM44Gj44GfPC9zcGFuPiA9ICJoYWQgZ29uZSI7IHlvdSBib3VnaHQgYWZ0ZXIgYXJyaXZpbmcu",
    "explain": "TDIzIGNvbnRyYXN0OiA8c3BhbiBjbGFzcz0ianAiPuihjOOBjyDjgajjgY08L3NwYW4+IChiZWZvcmUgZ29pbmcgLyBvbiB0aGUgd2F5KSB2cyA8c3BhbiBjbGFzcz0ianAiPuihjOOBo+OBnyDjgajjgY08L3NwYW4+IChhZnRlciBhcnJpdmluZyAvIHdoaWxlIHRoZXJlKS4gVGhlIHZlcmIgZm9ybSBiZWZvcmUg44Go44GNIGlzIGNyaXRpY2FsIQ==",
    "connect": "8J+UlyBDb21wYXJlIHdpdGggTDI1IDxzcGFuIGNsYXNzPSJqcCI+fuOBn+OCiTwvc3Bhbj4gKHdoZW4vaWYpIGFuZCA8c3BhbiBjbGFzcz0ianAiPn7jgag8L3NwYW4+ICh3aGVuZXZlcikuIFRoZSBjb25kaXRpb25hbCBmYW1pbHkgZXhwYW5kcyByYXBpZGx5IEwyMyDihpIgTDI1Lg==",
    "warn": "4pqg77iPIFRoZSB2ZXJiIGluIGZyb250IG9mIOOBqOOBjSBpcyBpbiBQTEFJTiBmb3JtLiA8c3BhbiBjbGFzcz0ianAiPuihjOOBjeOBvuOBl+OBnyDjgajjgY08L3NwYW4+IOKcly4="
  },
  {
    "lesson": 24,
    "type": "N5 · 文法1",
    "stem": "Ik15IGZyaWVuZCB0YXVnaHQgbWUgSmFwYW5lc2UiOjxicj48c3BhbiBjbGFzcz0ianAiPjxydWJ5PuWPizxydD7jgajjgoI8L3J0PjwvcnVieT7jgaDjgaHjgYwg44KP44Gf44GX44GrIDxydWJ5PuaXpeacrOiqnjxydD7jgavjgbvjgpPjgZQ8L3J0PjwvcnVieT7jgpIgPHJ1Ynk+5pWZPHJ0PuOBiuOBlzwvcnQ+PC9ydWJ5PuOBiOOBpiA8c3BhbiBjbGFzcz0iYmxhbmsiPj88L3NwYW4+44CCPC9zcGFuPg==",
    "answer": "44GP44KM44G+44GX44Gf",
    "choices": [
      "くれました",
      "あげました",
      "もらいました",
      "やりました"
    ],
    "correctNote": "V2hlbiBTT01FT05FIEVMU0UgZG9lcyBhIGtpbmQgYWN0aW9uIEZPUiBNRSwgdXNlIDxzcGFuIGNsYXNzPSJqcCI+fuOBpuOBj+OCjOOCizwvc3Bhbj4uIFRoZSBmcmllbmQgdGF1Z2h0IE1FIOKGkiDjgY/jgozjgosu",
    "explain": "TDI0IHRyaW86IDxzcGFuIGNsYXNzPSJqcCI+fuOBpuOBguOBkuOCizwvc3Bhbj4gKEkgZG8gZm9yIHNvbWVvbmUpLCA8c3BhbiBjbGFzcz0ianAiPn7jgabjgoLjgonjgYY8L3NwYW4+IChJIHJlY2VpdmUgYSBmYXZvciksIDxzcGFuIGNsYXNzPSJqcCI+fuOBpuOBj+OCjOOCizwvc3Bhbj4gKHNvbWVvbmUgZG9lcyBmb3IgbWUpLiBEaXJlY3Rpb24gbWF0dGVycyE=",
    "connect": "8J+UlyBUaGlzIHRyaW8gRVhQQU5EUyBpbiBONCBMMTggYW5kIEEyIEwxOCDigJQgdGhyZWUgbGF5ZXJzIGFjcm9zcyBONeKGkk404oaSQTIuIFRoZSBtb3N0IGNyb3NzLWxlc3NvbiBjb25jZXB0IGluIHlvdXIgY291cnNlLg==",
    "warn": "4pqg77iPIDxzcGFuIGNsYXNzPSJqcCI+44GC44GS44G+44GX44GfPC9zcGFuPiB3b3VsZCBtZWFuICJJIGdhdmUiIOKAlCB3cm9uZyBkaXJlY3Rpb24h"
  },
  {
    "lesson": 25,
    "type": "N5 · 文法2 ★",
    "stem": "QnVpbGQgdGhlIHNlbnRlbmNlIGJ5IG9yZGVyaW5nIHRoZSA0IGZyYWdtZW50cy4gV2hpY2ggd29yZCBnb2VzIGluIHRoZSDimIUgcG9zaXRpb24/PGJyPjxicj48c3BhbiBjbGFzcz0ianAiPjxydWJ5PuWutjxydD7jgYTjgYg8L3J0PjwvcnVieT7jgasgPHNwYW4gY2xhc3M9ImJsYW5rIj7ikaA8L3NwYW4+IDxzcGFuIGNsYXNzPSJibGFuayI+4piFPC9zcGFuPiA8c3BhbiBjbGFzcz0iYmxhbmsiPuKRojwvc3Bhbj4gPHNwYW4gY2xhc3M9ImJsYW5rIj7ikaM8L3NwYW4+IDxydWJ5Pumbu+ipsTxydD7jgafjgpPjgo88L3J0PjwvcnVieT7jgZfjgb7jgZnjgII8L3NwYW4+PGJyPjxicj5Xb3JkIGJhbms6IDxzcGFuIGNsYXNzPSJqcCI+44KJIMK3IDxydWJ5PuW4sDxydD7jgYvjgYg8L3J0PjwvcnVieT7jgaPjgZ8gwrcgPHJ1Ynk+5Y+LPHJ0PuOBqOOCgjwvcnQ+PC9ydWJ5PuOBoOOBoeOBqyDCtyDjgZnjgZA8L3NwYW4+",
    "answer": "44KJ",
    "choices": [
      "帰った",
      "すぐ",
      "ら",
      "友だちに"
    ],
    "correctNote": "4piFIHBvc2l0aW9uIChzbG90IDIpID0gPHNwYW4gY2xhc3M9ImpwIj7jgok8L3NwYW4+LiBCdWlsdDogPHNwYW4gY2xhc3M9ImpwIj7lrrbjgasgPHN0cm9uZz7luLDjgaPjgZ8g44KJIOOBmeOBkCDlj4vjgaDjgaHjgas8L3N0cm9uZz4g6Zu76Kmx44GX44G+44GZ44CCPC9zcGFuPg==",
    "explain": "PHNwYW4gY2xhc3M9ImpwIj5+44Gf44KJPC9zcGFuPiA9IGNvbmRpdGlvbmFsICJpZi93aGVuLiIgQnVpbHQgb24gdGhlIOOBny1mb3JtOiA8c3BhbiBjbGFzcz0ianAiPuW4sOOBo+OBnyArIOOCiTwvc3Bhbj4uIEhlcmU6ICJXaGVuIEkgZ2V0IGhvbWUsIEknbGwgY2FsbCBteSBmcmllbmQgcmlnaHQgYXdheS4i",
    "connect": "8J+UlyBUaGUgY29uZGl0aW9uYWwgZmFtaWx5OiA8c3BhbiBjbGFzcz0ianAiPn7jgag8L3NwYW4+ICh3aGVuZXZlci1jYXVzZXMpLCA8c3BhbiBjbGFzcz0ianAiPn7jgbA8L3NwYW4+IChpZi1jb3VsZCksIDxzcGFuIGNsYXNzPSJqcCI+fuOBn+OCiTwvc3Bhbj4gKGlmL3doZW4pLCA8c3BhbiBjbGFzcz0ianAiPn7jgarjgok8L3NwYW4+IChpbiB0aGF0IGNhc2Ug4oCUIEEyIEw0KS4=",
    "warn": "4pqg77iPIERvIE5PVCBjb25mdXNlIDxzcGFuIGNsYXNzPSJqcCI+fuOBn+OCiTwvc3Bhbj4gd2l0aCA8c3BhbiBjbGFzcz0ianAiPn7jgZ/jgoo8L3NwYW4+IChMMTksIGxpc3RpbmcgZXhhbXBsZXMpLiBPbmUg44KJLCB0d28g44O844KKLg=="
  },
  {
    "lesson": 25,
    "type": "N5 · 文法1",
    "stem": "IkV2ZW4gaWYgaXQgcmFpbnMsIEkgd2lsbCBnbyI6PGJyPjxzcGFuIGNsYXNzPSJqcCI+PHJ1Ynk+6ZuoPHJ0PuOBguOCgTwvcnQ+PC9ydWJ5PuOBjCA8c3BhbiBjbGFzcz0iYmxhbmsiPj88L3NwYW4+44CB6KGM44GN44G+44GZ44CCPC9zcGFuPg==",
    "answer": "44G144Gj44Gm44KC",
    "choices": [
      "ふっても",
      "ふって",
      "ふったら",
      "ふると"
    ],
    "correctNote": "PHNwYW4gY2xhc3M9ImpwIj5WLeOBpiArIOOCgjwvc3Bhbj4gPSAiZXZlbiBpZiBWLiIgQnVpbHQgZnJvbSB0aGUg44GmLWZvcm0uIDxzcGFuIGNsYXNzPSJqcCI+44G144KLIOKGkiDjgbXjgaPjgaYg4oaSIOOBteOBo+OBpuOCgjwvc3Bhbj4u",
    "explain": "Q29tcGFyZTogPHNwYW4gY2xhc3M9ImpwIj5+44Gf44KJPC9zcGFuPiA9ICJpZi93aGVuICh0aGVuIHdpbGwgaGFwcGVuKS4iIDxzcGFuIGNsYXNzPSJqcCI+fuOBpuOCgjwvc3Bhbj4gPSAiZXZlbiBpZiAod29uJ3QgY2hhbmdlIHJlc3VsdCkuIiBDb25jZXNzaW9uIHZzIGNvbmRpdGlvbi4=",
    "connect": "8J+UlyB+44Gm44KCIGlzIHRoZSB0ZS1mb3JtJ3MgN3RoIG1ham9yIGpvYi4gVGhlIOOAjOOCguOAjSBoZXJlIGlzIHRoZSBzYW1lICJldmVuL2Fsc28iIOOCgiBmb3VuZCBpbiBONCBMNyAoPHNwYW4gY2xhc3M9ImpwIj5+44Gn44KC44GE44GEPC9zcGFuPiku",
    "warn": "4pqg77iPIDxzcGFuIGNsYXNzPSJqcCI+44G144Gj44Gm44KCPC9zcGFuPiDiiaAgPHNwYW4gY2xhc3M9ImpwIj7jgbXjgaPjgabjgIF+44KCPC9zcGFuPi4gVGhlIOOCgiBhdHRhY2hlcyBESVJFQ1RMWSBhZnRlciB0aGUg44GmLWZvcm0gYXMgb25lIHVuaXQu"
  },
  {
    "lesson": 26,
    "type": "N4 · 文法1",
    "stem": "Q2FzdWFsIChwbGFpbikgdmVyc2lvbiBvZiA8c3BhbiBjbGFzcz0ianAiPuOBguOBl+OBnyDpo5/jgbnjgb7jgZk8L3NwYW4+Og==",
    "answer": "44GC44GX44GfIOmjn+OBueOCiw==",
    "choices": [
      "あした 食べる",
      "あした 食べます",
      "あした 食べた",
      "あした 食べる です"
    ],
    "correctNote": "UGxhaW4gY2FzdWFsIHNlbnRlbmNlcyB1c2UgdGhlIGRpY3Rpb25hcnkgZm9ybSBhbG9uZSDigJQgbm8g44Gn44GZLCBubyDjgb7jgZku",
    "explain": "TjQgTDEgY29uc29saWRhdGVzIHRoZSBwb2xpdGUvcGxhaW4gc3BsaXQgdGhhdCBzdGFydGVkIGluIE41IEwyMC4gQ2FzdWFsIHJlZ2lzdGVyIGRyb3BzIOOBp+OBmS/jgaAgaW4gbWFueSBwb3NpdGlvbnMu",
    "connect": "8J+UlyBQbGFpbiBmb3JtIGlzIHRoZSBHQVRFV0FZIHRvIGVtYmVkZGVkIGNsYXVzZXMgKH7jgajjgYrjgoLjgYYsIH7jgajjgYTjgYTjgb7jgZksIH7jgajjgY0sIH7jgYvjgonjgIEsIH7jga7jgafjgIEpIOKAlCB3aXRob3V0IGl0LCBjb21wbGV4IHNlbnRlbmNlcyBhcmUgaW1wb3NzaWJsZS4=",
    "warn": "4pqg77iPIFdpdGggbm91bnMv44GqLWFkaiBpbiBjYXN1YWw6IDxzcGFuIGNsYXNzPSJqcCI+5a2m55Sf44GgPC9zcGFuPiAobWlkLWZvcm1hbCkgb3IganVzdCA8c3BhbiBjbGFzcz0ianAiPuWtpueUnzwvc3Bhbj4gKHZlcnkgY2FzdWFsKS4gTkVWRVIgPHNwYW4gY2xhc3M9ImpwIj7lrabnlJ8g44Gg44Gn44GZPC9zcGFuPi4="
  },
  {
    "lesson": 26,
    "type": "N4 · 文法2 ★",
    "stem": "QnVpbGQgdGhlIHNlbnRlbmNlIGJ5IG9yZGVyaW5nIHRoZSA0IGZyYWdtZW50cy4gV2hpY2ggd29yZCBnb2VzIGluIHRoZSDimIUgcG9zaXRpb24/PGJyPjxicj48c3BhbiBjbGFzcz0ianAiPuOBjeOCgOOCieOBleOCk+OBryA8c3BhbiBjbGFzcz0iYmxhbmsiPuKRoDwvc3Bhbj4gPHNwYW4gY2xhc3M9ImJsYW5rIj7ikaE8L3NwYW4+IDxzcGFuIGNsYXNzPSJibGFuayI+4pGiPC9zcGFuPiA8c3BhbiBjbGFzcz0iYmxhbmsiPuKYhTwvc3Bhbj4gPHJ1Ynk+6KiAPHJ0PuOBhDwvcnQ+PC9ydWJ5PuOBhOOBvuOBl+OBn+OAgjwvc3Bhbj48YnI+PGJyPldvcmQgYmFuazogPHNwYW4gY2xhc3M9ImpwIj48cnVieT7lpKfpmKo8cnQ+44GK44GK44GV44GLPC9ydD48L3J1Ynk+44G4IMK3IOOBqCDCtyDjgYLjgZfjgZ8gwrcgPHJ1Ynk+6KGMPHJ0PuOBhDwvcnQ+PC9ydWJ5PuOBjzwvc3Bhbj4=",
    "answer": "44Go",
    "choices": [
      "あした",
      "大阪へ",
      "行く",
      "と"
    ],
    "correctNote": "4piFIHBvc2l0aW9uIChzbG90IDQpID0gPHNwYW4gY2xhc3M9ImpwIj7jgag8L3NwYW4+LiBCdWlsdDogPHNwYW4gY2xhc3M9ImpwIj7jgY3jgoDjgonjgZXjgpPjga8gPHN0cm9uZz7jgYLjgZfjgZ8g5aSn6Ziq44G4IOihjOOBjyDjgag8L3N0cm9uZz4g6KiA44GE44G+44GX44Gf44CCPC9zcGFuPg==",
    "explain": "RW1iZWRkZWQgY2xhdXNlcyBpbnNpZGUgPHNwYW4gY2xhc3M9ImpwIj5+44GoPHJ1Ynk+6KiAPHJ0PuOBhDwvcnQ+PC9ydWJ5PuOBhiAvIDxydWJ5PuaAnTxydD7jgYrjgoI8L3J0PjwvcnVieT7jgYY8L3NwYW4+IHJlcXVpcmUgUExBSU4gZm9ybSAoPHNwYW4gY2xhc3M9ImpwIj7ooYzjgY88L3NwYW4+KSwgbmV2ZXIg44G+44GZIOKAlCBldmVuIGluIHBvbGl0ZSBzZW50ZW5jZXMuIOOBqCBzaXRzIHJpZ2h0IGJldHdlZW4gdGhlIGVtYmVkZGVkIGNsYXVzZSBhbmQg6KiA44GGLg==",
    "connect": "8J+UlyBTYW1lIHBsYWluLWZvcm0taW5zaWRlIHJ1bGUgYXBwbGllcyB0byA8c3BhbiBjbGFzcz0ianAiPn7jgajjgY08L3NwYW4+IChONSBMMjMpLCA8c3BhbiBjbGFzcz0ianAiPn7jgYvjgonjgIE8L3NwYW4+IChONSBMOSksIDxzcGFuIGNsYXNzPSJqcCI+fuOBruOBp+OAgTwvc3Bhbj4gKEEyIEwzKSwgYW5kIG5vdW4gbW9kaWZpY2F0aW9uIChONSBMMjIpLg==",
    "warn": null
  },
  {
    "lesson": 27,
    "type": "N4 · 文法1",
    "stem": "Ik15IGhvYmJ5IGlzIHJlYWRpbmcgYm9va3MiOjxicj48c3BhbiBjbGFzcz0ianAiPuOCj+OBn+OBl+OBriDjgZfjgoXjgb/jga8gPHJ1Ynk+5pysPHJ0PuOBu+OCkzwvcnQ+PC9ydWJ5PuOCkiA8c3BhbiBjbGFzcz0iYmxhbmsiPj88L3NwYW4+IOOBp+OBmeOAgjwvc3Bhbj4=",
    "answer": "6Kqt44KA44GT44Go",
    "choices": [
      "読むこと",
      "読みこと",
      "読みます",
      "読む"
    ],
    "correctNote": "PHNwYW4gY2xhc3M9ImpwIj5WLei+nuabuOW9oiArIOOBk+OBqDwvc3Bhbj4gdHVybnMgYSB2ZXJiIGludG8gYSBub3VuICgicmVhZGluZyIpLiA8c3BhbiBjbGFzcz0ianAiPuiqreOCgOOBk+OBqDwvc3Bhbj4gPSAidGhlIGFjdCBvZiByZWFkaW5nLiI=",
    "explain": "UGF0dGVybjogPHNwYW4gY2xhc3M9ImpwIj5bdG9waWNdIOOBryBbdmVyYi3jgZPjgahdIOOBp+OBmTwvc3Bhbj4uIFVzZWQgdG8gZXhwcmVzcyBob2JiaWVzLCBwbGFucywgZHJlYW1zLg==",
    "connect": "8J+UlyBUaGUgc2FtZSDjgZPjgagtbm9taW5hbGl6YXRpb24gcG93ZXJzIE41IEwxOCAoPHNwYW4gY2xhc3M9ImpwIj5WLeOBk+OBqCDjgYwg44Gn44GN44KLPC9zcGFuPikgYW5kIE41IEwxOSAoPHNwYW4gY2xhc3M9ImpwIj5WLeOBnyDjgZPjgagg44GMIOOBguOCizwvc3Bhbj4pLg==",
    "warn": "4pqg77iPIDxzcGFuIGNsYXNzPSJqcCI+44GuPC9zcGFuPiBjYW4gYWxzbyBub21pbmFsaXplOiA8c3BhbiBjbGFzcz0ianAiPuiqreOCgOOBruOBjOWlveOBjTwvc3Bhbj4g4pyTLiBCb3RoIHdvcms7IOOBk+OBqCBmZWVscyBzbGlnaHRseSBtb3JlIGZvcm1hbC9nZW5lcmFsLg=="
  },
  {
    "lesson": 28,
    "type": "N4 · 文法1",
    "stem": "Ik15IEphcGFuZXNlIGhhcyBnb3R0ZW4gYmV0dGVyIjo8YnI+PHNwYW4gY2xhc3M9ImpwIj7jgo/jgZ/jgZfjga4gPHJ1Ynk+5pel5pys6KqePHJ0PuOBq+OBu+OCk+OBlDwvcnQ+PC9ydWJ5PuOBryA8cnVieT7kuIrmiYs8cnQ+44GY44KH44GG44GaPC9ydD48L3J1Ynk+PHNwYW4gY2xhc3M9ImJsYW5rIj4/PC9zcGFuPiDjgarjgorjgb7jgZfjgZ/jgII8L3NwYW4+",
    "answer": "44Gr",
    "choices": [
      "に",
      "く",
      "と",
      "で"
    ],
    "correctNote": "PHNwYW4gY2xhc3M9ImpwIj7kuIrmiYs8L3NwYW4+IGlzIGEg44GqLWFkamVjdGl2ZSDihpIgdXNlIDxzcGFuIGNsYXNzPSJqcCI+44GrICsg44Gq44KLPC9zcGFuPi4g44GELWFkaiB3b3VsZCB1c2UgPHNwYW4gY2xhc3M9ImpwIj5+44GPICsg44Gq44KLPC9zcGFuPi4=",
    "explain": "44GELWFkaiA8c3BhbiBjbGFzcz0ianAiPuWkp+OBjeOBhCDihpIg5aSn44GN44GP44Gq44KLPC9zcGFuPjsg44GqLWFkai9OIDxzcGFuIGNsYXNzPSJqcCI+5LiK5omLIOKGkiDkuIrmiYvjgavjgarjgos8L3NwYW4+OyA8c3BhbiBjbGFzcz0ianAiPuWtpueUnyDihpIg5a2m55Sf44Gr44Gq44KLPC9zcGFuPi4=",
    "connect": "8J+UlyBONSBMMTkgaW50cm9kdWNlZCA8c3BhbiBjbGFzcz0ianAiPn7jgY8gLyB+44GrIOOBquOCiuOBvuOBmTwvc3Bhbj4uIE40IEwzIHJlaW5mb3JjZXMgaXQuIEEyIEwxNCBhZGRzIDxzcGFuIGNsYXNzPSJqcCI+fuOBjy/jgasg44GZ44KLPC9zcGFuPiA9ICJtYWtlIFggWSIgKHRoZSBhY3RpdmUgY291bnRlcnBhcnQpLg==",
    "warn": "4pqg77iPIFBhc3QgdGVuc2U6IDxzcGFuIGNsYXNzPSJqcCI+fuOBqyDjgarjgorjgb7jgZfjgZ88L3NwYW4+ID0gImJlY2FtZS4iIERvbid0IGNvbmZ1c2Ugd2l0aCA8c3BhbiBjbGFzcz0ianAiPn7jgasg44GX44G+44GZPC9zcGFuPiA9ICJJIGNob29zZSAvIGRlY2lkZSBvbi4i"
  },
  {
    "lesson": 29,
    "type": "N4 · 文法1",
    "stem": "IlRoYXQncyB0b3VnaCwgaXNuJ3QgaXQiIChzaG93aW5nIHN5bXBhdGh5KTo8YnI+PHNwYW4gY2xhc3M9ImpwIj5BOiA8cnVieT7poK08cnQ+44GC44Gf44G+PC9ydD48L3J1Ynk+44GMIOOBhOOBn+OBhOOBp+OBmeOAgjxicj5COiDjgZ3jgYbjgafjgZk8c3BhbiBjbGFzcz0iYmxhbmsiPj88L3NwYW4+44CCIDxydWJ5PuWkp+WkiTxydD7jgZ/jgYTjgbjjgpM8L3J0PjwvcnVieT7jgafjgZnjga3jgII8L3NwYW4+",
    "answer": "44Gt",
    "choices": [
      "ね",
      "よ",
      "か",
      "の"
    ],
    "correctNote": "PHNwYW4gY2xhc3M9ImpwIj5+44GtPC9zcGFuPiBzZWVrcyBBR1JFRU1FTlQgYW5kIHNob3dzIEVNUEFUSFkg4oCUIHNoYXJpbmcgdGhlIGxpc3RlbmVyJ3MgZmVlbGluZy4=",
    "explain": "U2VudGVuY2UtZmluYWwgcGFydGljbGVzOiA8c3BhbiBjbGFzcz0ianAiPuOBrTwvc3Bhbj4gKHNoYXJlZCBrbm93bGVkZ2UgLyBzeW1wYXRoeSksIDxzcGFuIGNsYXNzPSJqcCI+44KIPC9zcGFuPiAoaW5mb3JtaW5nIOKAlCBuZXcgaW5mbyksIDxzcGFuIGNsYXNzPSJqcCI+44KI44GtPC9zcGFuPiAoc2Vla2luZyBjb25maXJtYXRpb24pLg==",
    "connect": "8J+UlyBONSBMNCBpbnRyb2R1Y2VkIOOBrS/jgoggYnJpZWZseS4gTjQgTDQgdXNlcyDjga0gZm9yIFNZTVBBVEhZIHNwZWNpZmljYWxseS4gQTIgTDMgYWRkcyA8c3BhbiBjbGFzcz0ianAiPuOCiOOBrTwvc3Bhbj4gKG1peGluZyBib3RoKS4=",
    "warn": "4pqg77iPIFNheWluZyA8c3BhbiBjbGFzcz0ianAiPuOCiDwvc3Bhbj4gd2hlbiBzeW1wYXRoaXppbmcgc291bmRzIENPTEQg4oCUICJ3ZWxsLCBpdCdzIHRvdWdoLiIgVXNlIOOBrSBmb3Igd2FybXRoLg=="
  },
  {
    "lesson": 30,
    "type": "N4 · 文法2 ★",
    "stem": "QnVpbGQgdGhlIHNlbnRlbmNlIGJ5IG9yZGVyaW5nIHRoZSA0IGZyYWdtZW50cy4gV2hpY2ggd29yZCBnb2VzIGluIHRoZSDimIUgcG9zaXRpb24/PGJyPjxicj48c3BhbiBjbGFzcz0ianAiPuOBk+OBriDjg6zjgrnjg4jjg6njg7Pjga8gPHNwYW4gY2xhc3M9ImJsYW5rIj7ikaA8L3NwYW4+IDxzcGFuIGNsYXNzPSJibGFuayI+4pGhPC9zcGFuPiA8c3BhbiBjbGFzcz0iYmxhbmsiPuKRojwvc3Bhbj4gPHNwYW4gY2xhc3M9ImJsYW5rIj7imIU8L3NwYW4+IOOBp+OBmeOAgjwvc3Bhbj48YnI+PGJyPldvcmQgYmFuazogPHNwYW4gY2xhc3M9ImpwIj7jgZHjgakgwrcgPHJ1Ynk+6auYPHJ0PuOBn+OBizwvcnQ+PC9ydWJ5PuOBhCDCtyDjgYrjgYTjgZfjgYQgwrcg44Gn44GZPC9zcGFuPg==",
    "answer": "6auY44GE",
    "choices": [
      "おいしい",
      "です",
      "けど",
      "高い"
    ],
    "correctNote": "4piFIHBvc2l0aW9uIChzbG90IDQpID0gPHNwYW4gY2xhc3M9ImpwIj7pq5jjgYQ8L3NwYW4+LiBCdWlsdDogPHNwYW4gY2xhc3M9ImpwIj7jgZPjga4g44Os44K544OI44Op44Oz44GvIDxzdHJvbmc+44GK44GE44GX44GEIOOBp+OBmSDjgZHjgakg6auY44GEPC9zdHJvbmc+IOOBp+OBmeOAgjwvc3Bhbj4=",
    "explain": "PHNwYW4gY2xhc3M9ImpwIj5+44GR44GpPC9zcGFuPiBjb25uZWN0cyB0d28gY2xhdXNlcyB3aXRoIGNvbnRyYXN0ICg9ICJidXQiKS4gVGhlIGNvbnRyYXN0ZWQgc2Vjb25kIGFkamVjdGl2ZSBzaXRzIHJpZ2h0IGJlZm9yZSB0aGUgZmluYWwg44Gn44GZLg==",
    "connect": "8J+UlyBONSBMOCBoYWQgfuOBjOOAgX4gZm9yIGNvbnRyYXN0LiBONCBMNSBpbnRyb2R1Y2VzIH7jgZHjgakgYXMgdGhlIGV2ZXJ5ZGF5IHNwb2tlbiBhbHRlcm5hdGl2ZS4=",
    "warn": "4pqg77iPIDxzcGFuIGNsYXNzPSJqcCI+44GR44GpPC9zcGFuPiBpcyBpbmZvcm1hbC4gSW4gd3JpdGluZywgPHNwYW4gY2xhc3M9ImpwIj7jgYw8L3NwYW4+IG9yIDxzcGFuIGNsYXNzPSJqcCI+44GR44KM44Gp44KCPC9zcGFuPiBhcmUgc2FmZXIu"
  },
  {
    "lesson": 31,
    "type": "N4 · 文法1",
    "stem": "Ik5vdCBjb2ZmZWUsIGJ1dCB0ZWEiOjxicj48c3BhbiBjbGFzcz0ianAiPuOCs+ODvOODkuODvCA8c3BhbiBjbGFzcz0iYmxhbmsiPj88L3NwYW4+44CBIDxydWJ5Pue0heiMtjxydD7jgZPjgYbjgaHjgoM8L3J0PjwvcnVieT7jgpIg44GP44Gg44GV44GE44CCPC9zcGFuPg==",
    "answer": "44GY44KD44Gq44GP44Gm",
    "choices": [
      "じゃなくて",
      "じゃない",
      "じゃ ありません",
      "じゃなければ"
    ],
    "correctNote": "PHNwYW4gY2xhc3M9ImpwIj5OMSDjgZjjgoPjgarjgY/jgabjgIEgTjI8L3NwYW4+ID0gIm5vdCBOMSwgYnV0IE4yLiIgVXNlZCB0byBjb3JyZWN0IG9yIGNvbnRyYXN0IG5vdW5zLg==",
    "explain": "SXQncyB0aGUg44GmLWZvcm0gb2Yg44GY44KD44Gq44GEICg9IOOBquOBhCBmb3Igbm91bnMv44GqLWFkaikuIEZ1bmN0aW9ucyBhcyBhIGNvbm5lY3RvcjogInJhdGhlciB0aGFuIFgsIFkuIg==",
    "connect": "8J+UlyBGb3IgdmVyYnMvaS1hZGosIHRoZSBlcXVpdmFsZW50IGlzIDxzcGFuIGNsYXNzPSJqcCI+fuOBquOBj+OBpuOAgX48L3NwYW4+LiBJbiBBMiBMNCB5b3UnbGwgbWVldCA8c3BhbiBjbGFzcz0ianAiPlYt44Gq44GE44Gn44CBfjwvc3Bhbj4gZm9yICJ3aXRob3V0IGRvaW5nLiIgVGhyZWUgbnVhbmNlcyE=",
    "warn": "4pqg77iPIDxzcGFuIGNsYXNzPSJqcCI+44GY44KD44Gq44GEPC9zcGFuPiBhbG9uZSAod2l0aG91dCDjgaYpIG1lYW5zICJpc24ndCIg4oCUIGEgc2VudGVuY2UtZmluYWwgZm9ybSwgbm90IGEgY29ubmVjdG9yLg=="
  },
  {
    "lesson": 32,
    "type": "N4 · 文法1",
    "stem": "IklzIHRvbW9ycm93IE9LICh3b3VsZCB0b21vcnJvdyB3b3JrKT8iOjxicj48c3BhbiBjbGFzcz0ianAiPuOBguOBl+OBnyA8c3BhbiBjbGFzcz0iYmxhbmsiPj88L3NwYW4+IOOBhOOBhOOBp+OBmeOBi+OAgjwvc3Bhbj4=",
    "answer": "44Gn44KC",
    "choices": [
      "でも",
      "とも",
      "にも",
      "を"
    ],
    "correctNote": "PHNwYW4gY2xhc3M9ImpwIj5OIOOBp+OCgiDjgYTjgYTjgafjgZnjgYs8L3NwYW4+ID0gIldvdWxkIE4gYWxzbyBiZSBPSz8iIOKAlCBzb2Z0ZXIgYW5kIG1vcmUgZmxleGlibGUgdGhhbiBqdXN0IOOBp+OBhOOBhOOBp+OBmeOBiy4=",
    "explain": "VGhlIOOBp+OCgiBoZXJlIG1lYW5zICJldmVuIC8gYWxzbyIg4oCUIHNvZnRlbnMgdGhlIHF1ZXN0aW9uIGFuZCBzaWduYWxzIGZsZXhpYmlsaXR5Lg==",
    "connect": "8J+UlyDjgafjgoIgaXMgbXVsdGktZnVuY3Rpb25hbDogImJ1dCIgKGNvbmp1bmN0aW9uKSwgImV2ZW4vYWxzbyIgKHRoaXMgbGVzc29uKSwgImFueX4iICg8c3BhbiBjbGFzcz0ianAiPuOBhOOBpOOBp+OCguODu+OBqeOBk+OBp+OCgjwvc3Bhbj4gZnJvbSBONSBMMjEpLg==",
    "warn": "4pqg77iPIDxzcGFuIGNsYXNzPSJqcCI+fuOBpuOCgjwvc3Bhbj4gKHZlcmIpIOKJoCA8c3BhbiBjbGFzcz0ianAiPn7jgafjgoI8L3NwYW4+IChub3VuKSDigJQgc2FtZSBpZGVhLCBkaWZmZXJlbnQgYXR0YWNobWVudC4="
  },
  {
    "lesson": 33,
    "type": "N4 · 文法2 ★",
    "stem": "QnVpbGQgdGhlIHNlbnRlbmNlIGJ5IG9yZGVyaW5nIHRoZSA0IGZyYWdtZW50cy4gV2hpY2ggd29yZCBnb2VzIGluIHRoZSDimIUgcG9zaXRpb24/PGJyPjxicj48c3BhbiBjbGFzcz0ianAiPuOCj+OBn+OBl+OBryA8c3BhbiBjbGFzcz0iYmxhbmsiPuKRoDwvc3Bhbj4gPHNwYW4gY2xhc3M9ImJsYW5rIj7ikaE8L3NwYW4+IDxzcGFuIGNsYXNzPSJibGFuayI+4piFPC9zcGFuPiA8c3BhbiBjbGFzcz0iYmxhbmsiPuKRozwvc3Bhbj4g44GC44KK44G+44GZ44CCPC9zcGFuPjxicj48YnI+V29yZCBiYW5rOiA8c3BhbiBjbGFzcz0ianAiPuOBk+OBqOOBjCDCtyA8cnVieT7kuqzpg708cnQ+44GN44KH44GG44GoPC9ydD48L3J1Ynk+44GrIMK3IDxydWJ5PuS4gOW6pjxydD7jgYTjgaHjgak8L3J0PjwvcnVieT4gwrcgPHJ1Ynk+6KGMPHJ0PuOBhDwvcnQ+PC9ydWJ5PuOBo+OBnzwvc3Bhbj4=",
    "answer": "6KGM44Gj44Gf",
    "choices": [
      "一度",
      "京都に",
      "行った",
      "ことが"
    ],
    "correctNote": "4piFIHBvc2l0aW9uIChzbG90IDMpID0gPHNwYW4gY2xhc3M9ImpwIj7ooYzjgaPjgZ88L3NwYW4+LiBCdWlsdDogPHNwYW4gY2xhc3M9ImpwIj7jgo/jgZ/jgZfjga8gPHN0cm9uZz7kuIDluqYg5Lqs6YO944GrIOihjOOBo+OBnyDjgZPjgajjgYw8L3N0cm9uZz4g44GC44KK44G+44GZ44CCPC9zcGFuPg==",
    "explain": "UGFzdC1leHBlcmllbmNlIHBhdHRlcm46IDxzcGFuIGNsYXNzPSJqcCI+W2FkdmVyYl0gW2Rlc3RpbmF0aW9uXSBWLeOBnyDjgZPjgajjgYwg44GC44KK44G+44GZPC9zcGFuPi4gVGhlIFYt44GfIGZvcm0gKDxzcGFuIGNsYXNzPSJqcCI+6KGM44Gj44GfPC9zcGFuPikgc2l0cyByaWdodCBiZWZvcmUg44GT44Go44GMLg==",
    "connect": "8J+UlyBTYW1lIOOBk+OBqCwgZGlmZmVyZW50IHZlcmItZm9ybSBnaXZlcyBkaWZmZXJlbnQgbWVhbmluZzogPHNwYW4gY2xhc3M9ImpwIj5WLei+nuabuCDjgZPjgajjgYzjgafjgY3jgos8L3NwYW4+IChONSBMMTgsIGFiaWxpdHkpIHZzIDxzcGFuIGNsYXNzPSJqcCI+Vi3jgZ8g44GT44Go44GM44GC44KLPC9zcGFuPiAoTjUgTDE5LCBleHBlcmllbmNlKS4=",
    "warn": null
  },
  {
    "lesson": 34,
    "type": "N4 · 文法1",
    "stem": "IlRva3lvIGhhcyBhIGxvdCBvZiBwZW9wbGUiOjxicj48c3BhbiBjbGFzcz0ianAiPjxydWJ5PuadseS6rDxydD7jgajjgYbjgY3jgofjgYY8L3J0PjwvcnVieT48c3BhbiBjbGFzcz0iYmxhbmsiPj88L3NwYW4+IDxydWJ5PuS6ujxydD7jgbLjgag8L3J0PjwvcnVieT7jgYwgPHJ1Ynk+5aSaPHJ0PuOBiuOBijwvcnQ+PC9ydWJ5PuOBhOOBp+OBmeOAgjwvc3Bhbj4=",
    "answer": "44Gv",
    "choices": [
      "は",
      "が",
      "を",
      "に"
    ],
    "correctNote": "UGF0dGVybjogPHNwYW4gY2xhc3M9ImpwIj5OMSDjga8gTjIg44GMIGFkajwvc3Bhbj4gPSAiU3BlYWtpbmcgb2YgTjEsIHRoZSBOMiBpcyBhZGouIiBUb2t5byBpcyB0aGUgdG9waWM7IHBlb3BsZS1jb3VudCBpcyB0aGUgY29tbWVudC4=",
    "explain": "44GvIG1hcmtzIHRoZSBCSUdHRVIgdG9waWMgKFRva3lvKTsg44GMIG1hcmtzIHRoZSBTUEVDSUZJQyBzdWJqZWN0IG9mIHRoZSBkZXNjcmlwdGlvbiAocGVvcGxlKS4gVGhpcyBkb3VibGUtcGFydGljbGUgcGF0dGVybiBpcyBpY29uaWMgSmFwYW5lc2Uu",
    "connect": "8J+UlyBONSBMMTYgYWxyZWFkeSBoYWQgPHNwYW4gY2xhc3M9ImpwIj5OMSDjga8gTjIg44GMIGFkajwvc3Bhbj4uIE40IEw5IHJlaW5mb3JjZXMgaXQuIEEyIEwyIGV4cGFuZHMgZnVydGhlciB0byBkZXNjcmlwdGlvbnMgb2YgcGVyc29uYWxpdHku",
    "warn": "4pqg77iPIDxzcGFuIGNsYXNzPSJqcCI+5p2x5Lqs44Gv5Lq644KS5aSa44GE44Gn44GZPC9zcGFuPiDinJcg4oCUIGFkamVjdGl2ZSBzdWJqZWN0cyB1c2Ug44GMLCBuZXZlciDjgpIu"
  },
  {
    "lesson": 35,
    "type": "N4 · 文法1",
    "stem": "IkknZCBsaWtlIHRvIHRyeSB3ZWFyaW5nIGEga2ltb25vIjo8YnI+PHNwYW4gY2xhc3M9ImpwIj48cnVieT7nnYDniak8cnQ+44GN44KC44GuPC9ydD48L3J1Ynk+44KSIDxzcGFuIGNsYXNzPSJibGFuayI+Pzwvc3Bhbj4g44GE44KT44Gn44GZ44CCPC9zcGFuPg==",
    "answer": "552A44Gm44G/44Gf",
    "choices": [
      "着てみた",
      "着てみる",
      "着みたい",
      "着たみたい"
    ],
    "correctNote": "PHNwYW4gY2xhc3M9ImpwIj5WLeOBpiArIOOBv+OCizwvc3Bhbj4gPSAidHJ5IGRvaW5nIFYuIiBBZGQgfuOBn+OBhCDihpIgPHNwYW4gY2xhc3M9ImpwIj7nnYDjgabjgb/jgZ/jgYQ8L3NwYW4+LiBSZW1vdmUg44GEIGZvciDjgpPjgafjgZkgYXR0YWNobWVudCDihpIgPHNwYW4gY2xhc3M9ImpwIj7nnYDjgabjgb/jgZ8gKyDjgYTjgpPjgafjgZk8L3NwYW4+Lg==",
    "explain": "VGhyZWUgcGllY2VzIHN0YWNrZWQ6IDxzcGFuIGNsYXNzPSJqcCI+PHJ1Ynk+552APHJ0PuOBjTwvcnQ+PC9ydWJ5PuOCiyArIOOBpuOBv+OCiyArIOOBn+OBhCArIOOCk+OBp+OBmTwvc3Bhbj4uIH7jgpPjgafjgZkgYWRkcyBudWFuY2UgKCJ0aGUgcmVhc29uIGJlaW5nLi4uIiAvIHNvZnQgcmVxdWVzdCku",
    "connect": "8J+UlyB+44Gm44G/44KLIHN0YWNrcyB3aXRoIE41IEwxMyB+44Gf44GEICh3YW50IHRvIGRvKSBhbmQgfuOCk+OBp+OBmSAoZXhwbGFuYXRpb24pLiBMYXllcmVkIGdyYW1tYXIgPSBONC1sZXZlbCBmbHVlbmN5Lg==",
    "warn": "4pqg77iPIDxzcGFuIGNsYXNzPSJqcCI+552A44G/44Gf44GEPC9zcGFuPiDinJcg4oCUIGRvbid0IHNraXAgdGhlIOOBpiBpbiA8c3BhbiBjbGFzcz0ianAiPn7jgabjgb/jgZ/jgYQ8L3NwYW4+LiBUaGUg44GmLWZvcm0gKDxzcGFuIGNsYXNzPSJqcCI+552A44GmPC9zcGFuPikgaXMgbWFuZGF0b3J5Lg=="
  },
  {
    "lesson": 36,
    "type": "N4 · 文法2 ★",
    "stem": "QnVpbGQgdGhlIHNlbnRlbmNlIGJ5IG9yZGVyaW5nIHRoZSA0IGZyYWdtZW50cy4gV2hpY2ggd29yZCBnb2VzIGluIHRoZSDimIUgcG9zaXRpb24/PGJyPjxicj48c3BhbiBjbGFzcz0ianAiPjxzcGFuIGNsYXNzPSJibGFuayI+4pGgPC9zcGFuPiA8c3BhbiBjbGFzcz0iYmxhbmsiPuKRoTwvc3Bhbj4gPHNwYW4gY2xhc3M9ImJsYW5rIj7ikaI8L3NwYW4+IDxzcGFuIGNsYXNzPSJibGFuayI+4piFPC9zcGFuPiA8cnVieT7pgJ88cnQ+44Gv44KEPC9ydD48L3J1Ynk+44GE44Gn44GZ44CCPC9zcGFuPjxicj48YnI+V29yZCBiYW5rOiA8c3BhbiBjbGFzcz0ianAiPuOBriDCtyDjgbvjgYbjgYwgwrcg44OQ44K544KI44KKIMK3IDxydWJ5Pumbu+i7ijxydD7jgafjgpPjgZfjgoM8L3J0PjwvcnVieT48L3NwYW4+",
    "answer": "44G744GG44GM",
    "choices": [
      "バスより",
      "電車",
      "の",
      "ほうが"
    ],
    "correctNote": "4piFIHBvc2l0aW9uIChzbG90IDQpID0gPHNwYW4gY2xhc3M9ImpwIj7jgbvjgYbjgYw8L3NwYW4+LiBCdWlsdDogPHNwYW4gY2xhc3M9ImpwIj48c3Ryb25nPuODkOOCueOCiOOCiiDpm7vou4og44GuIOOBu+OBhuOBjDwvc3Ryb25nPiDpgJ/jgYTjgafjgZnjgII8L3NwYW4+",
    "explain": "UGF0dGVybjogPHNwYW4gY2xhc3M9ImpwIj5CIOOCiOOCiiBBIOOBriDjgbvjgYbjgYwgYWRqPC9zcGFuPiA9ICJBIGlzIG1vcmUgYWRqIHRoYW4gQi4iIFRoZSDjga4gYXR0YWNoZXMgdG8gdGhlIG5vdW4gYmVpbmcgcHJlZmVycmVkOyDjgbvjgYbjgYwgc2l0cyByaWdodCBiZWZvcmUgdGhlIGFkamVjdGl2ZS4=",
    "connect": "8J+UlyBONSBMMTIgaW50cm9kdWNlZCB+44KI44KKfi4gTjQgTDExIGRlZXBlbnMgaXQgd2l0aCA8c3BhbiBjbGFzcz0ianAiPuOBqeOBo+OBoeOBjCArIOOBruOBu+OBhuOBjOOBhOOBhDwvc3Bhbj4gZm9yIGV2ZXJ5ZGF5IGNob2ljZS1tYWtpbmcu",
    "warn": "4pqg77iPIERvbid0IGRyb3AgdGhlIOOBrjogPHNwYW4gY2xhc3M9ImpwIj7pm7vou4og44G744GG44GMPC9zcGFuPiDinJcg4oCUIOOBriBpcyByZXF1aXJlZCBiZXR3ZWVuIHRoZSBwcmVmZXJyZWQgbm91biBhbmQg44G744GG44GMLg=="
  },
  {
    "lesson": 37,
    "type": "N4 · 文法1",
    "stem": "IlRoaXMgY2FrZSBsb29rcyBkZWxpY2lvdXMiOjxicj48c3BhbiBjbGFzcz0ianAiPuOBk+OBriDjgrHjg7zjgq3jga8g44GK44GE44GXPHNwYW4gY2xhc3M9ImJsYW5rIj4/PC9zcGFuPuOBp+OBmeOAgjwvc3Bhbj4=",
    "answer": "44Gd44GG",
    "choices": [
      "そう",
      "らしい",
      "みたい",
      "よう"
    ],
    "correctNote": "PHNwYW4gY2xhc3M9ImpwIj7jgYQtYWRqIHN0ZW0gKyDjgZ3jgYY8L3NwYW4+ID0gImxvb2tzIH4uIiA8c3BhbiBjbGFzcz0ianAiPuOBiuOBhOOBl+OBhCDihpIg44GK44GE44GX44Gd44GGPC9zcGFuPi4gVmlzdWFsIGp1ZGdtZW50IGJhc2VkIG9uIGFwcGVhcmFuY2Uu",
    "explain": "RHJvcCB0aGUgZmluYWwg44GEIGZyb20g44GELWFkaiBiZWZvcmUg44Gd44GGOiA8c3BhbiBjbGFzcz0ianAiPuOBiuOBhOOBl+OBhCDihpIg44GK44GE44GX44Gd44GGPC9zcGFuPi4gRVhDRVBUSU9OOiA8c3BhbiBjbGFzcz0ianAiPuOBhOOBhCDihpIg44KI44GV44Gd44GGPC9zcGFuPi4=",
    "connect": "8J+UlyBUd28g44Gd44GGJ3MgZXhpc3QhIE40IEwxMiDjgZ3jgYYgPSAibG9va3MgbGlrZSIgKGRyb3BzIOOBhCkuIE40IEwxOCDjgZ3jgYYgPSAiSSBoZWFyZCB0aGF0IiAoa2VlcHMgdGhlIGZ1bGwgcGxhaW4gZm9ybSkuIERpZmZlcmVudCBmb3JtcyE=",
    "warn": "4pqg77iPIDxzcGFuIGNsYXNzPSJqcCI+44GK44GE44GX44GE44Gd44GGPC9zcGFuPiDinJcgKHRoaXMgaXMgaGVhcnNheSBmb3JtISkg4oaSIDxzcGFuIGNsYXNzPSJqcCI+44GK44GE44GX44Gd44GGPC9zcGFuPiDinJMgKGFwcGVhcmFuY2UgZm9ybSBkcm9wcyB0aGUg44GEKS4="
  },
  {
    "lesson": 38,
    "type": "N4 · 文法1",
    "stem": "IldoZW4geW91IHByZXNzIHRoaXMgYnV0dG9uLCB0aGUgZG9vciBvcGVucyI6PGJyPjxzcGFuIGNsYXNzPSJqcCI+44GT44GuIOODnOOCv+ODs+OCkiA8c3BhbiBjbGFzcz0iYmxhbmsiPj88L3NwYW4+44CB44OJ44Ki44GMIDxydWJ5PumWizxydD7jgYI8L3J0PjwvcnVieT7jgY3jgb7jgZnjgII8L3NwYW4+",
    "answer": "44GK44GZ44Go",
    "choices": [
      "おすと",
      "おしたら",
      "おしても",
      "おしてから"
    ],
    "correctNote": "PHNwYW4gY2xhc3M9ImpwIj5WLei+nuabuOW9oiArIOOBqDwvc3Bhbj4gPSAid2hlbmV2ZXIgViAodGhlbiBhdXRvbWF0aWNhbGx5KSB+LiIgVXNlZCBmb3IgbmF0dXJhbCBjb25zZXF1ZW5jZXMsIG1hY2hpbmUgb3BlcmF0aW9uLCBkaXJlY3Rpb25zLg==",
    "explain": "44GoIGV4cHJlc3NlcyBDQVVTRS1FRkZFQ1QgdGhhdCBhbHdheXMgb3IgbmF0dXJhbGx5IGhhcHBlbnMuIENvbXBhcmUgd2l0aCB+44Gf44KJIChzcGVjaWZpYyBpZi93aGVuKSBhbmQgfuOBsCAoaHlwb3RoZXRpY2FsKS4=",
    "connect": "8J+UlyBUaGUgY29uZGl0aW9uYWwgZmFtaWx5IGF0IE40OiA8c3BhbiBjbGFzcz0ianAiPn7jgag8L3NwYW4+IChhbHdheXMtcmVzdWx0KSwgPHNwYW4gY2xhc3M9ImpwIj5+44Gf44KJPC9zcGFuPiAoaWYvd2hlbiksIDxzcGFuIGNsYXNzPSJqcCI+fuOBsDwvc3Bhbj4gKGlmLWNvdWxkKSwgPHNwYW4gY2xhc3M9ImpwIj5+44Gq44KJPC9zcGFuPiAoaW4gdGhhdCBjYXNlIOKAlCBBMiBMNCku",
    "warn": "4pqg77iPIH7jgaggZG9lcyBOT1QgdGFrZSBjb21tYW5kcyBvciB3aXNoZXMgaW4gbWFpbiBjbGF1c2VzLiA8c3BhbiBjbGFzcz0ianAiPuaKvOOBmeOBqOOAgemWi+OBkeOBpuOBj+OBoOOBleOBhDwvc3Bhbj4g4pyXLg=="
  },
  {
    "lesson": 39,
    "type": "N4 · 文法2 ★",
    "stem": "QnVpbGQgdGhlIHNlbnRlbmNlIGJ5IG9yZGVyaW5nIHRoZSA0IGZyYWdtZW50cy4gV2hpY2ggd29yZCBnb2VzIGluIHRoZSDimIUgcG9zaXRpb24/PGJyPjxicj48c3BhbiBjbGFzcz0ianAiPuOBjeOBruOBhiA8cnVieT7pm6g8cnQ+44GC44KBPC9ydD48L3J1Ynk+44Gn44GX44Gf44CCIDxzcGFuIGNsYXNzPSJibGFuayI+4pGgPC9zcGFuPiA8c3BhbiBjbGFzcz0iYmxhbmsiPuKRoTwvc3Bhbj4gPHNwYW4gY2xhc3M9ImJsYW5rIj7ikaI8L3NwYW4+IDxzcGFuIGNsYXNzPSJibGFuayI+4piFPC9zcGFuPiDjgafjgZfjgZ/jgII8L3NwYW4+PGJyPjxicj5Xb3JkIGJhbms6IDxzcGFuIGNsYXNzPSJqcCI+44GMIMK3IOOBneOCjOOBpyDCtyA8cnVieT7kuK3mraI8cnQ+44Gh44KF44GG44GXPC9ydD48L3J1Ynk+IMK3IDxydWJ5PumBi+WLleS8mjxydD7jgYbjgpPjganjgYbjgYvjgYQ8L3J0PjwvcnVieT48L3NwYW4+",
    "answer": "5Lit5q2i",
    "choices": [
      "それで",
      "運動会",
      "が",
      "中止"
    ],
    "correctNote": "4piFIHBvc2l0aW9uIChzbG90IDQpID0gPHNwYW4gY2xhc3M9ImpwIj7kuK3mraI8L3NwYW4+LiBCdWlsdDogPHNwYW4gY2xhc3M9ImpwIj7jgY3jga7jgYYg6Zuo44Gn44GX44Gf44CCIDxzdHJvbmc+44Gd44KM44GnIOmBi+WLleS8miDjgYwg5Lit5q2iPC9zdHJvbmc+IOOBp+OBl+OBn+OAgjwvc3Bhbj4=",
    "explain": "PHNwYW4gY2xhc3M9ImpwIj7jgZ3jgozjgac8L3NwYW4+ID0gImFuZCBzbyAvIHRoZXJlZm9yZSIg4oCUIGNvbm5lY3RzIHR3byBTRU5URU5DRVMgd2l0aCBjYXVzZS1lZmZlY3QuIE9yZGVyOiA8c3BhbiBjbGFzcz0ianAiPuOBneOCjOOBpyBbc3ViamVjdF0g44GMIFtyZXN1bHRdIOOBp+OBl+OBnzwvc3Bhbj4uIFRoZSByZXN1bHQtbm91biBzaXRzIHJpZ2h0IGJlZm9yZSDjgafjgZfjgZ8u",
    "connect": "8J+UlyBUaGUgInRoZXJlZm9yZSIgZmFtaWx5OiA8c3BhbiBjbGFzcz0ianAiPuOBneOCjOOBpzwvc3Bhbj4gKHNvIOKAlCBuZXV0cmFsKSwgPHNwYW4gY2xhc3M9ImpwIj7jgaDjgYvjgok8L3NwYW4+IChzbyDigJQgZW1waGF0aWMpLCA8c3BhbiBjbGFzcz0ianAiPuOBp+OBmeOBi+OCiTwvc3Bhbj4gKHBvbGl0ZSksIDxzcGFuIGNsYXNzPSJqcCI+44Gu44GnPC9zcGFuPiAod2l0aGluIG9uZSBzZW50ZW5jZSDigJQgQTIgTDMpLg==",
    "warn": null
  },
  {
    "lesson": 40,
    "type": "N4 · 文法1",
    "stem": "Ik15IGhlYWQgaHVydHMgKGV4cGxhbmF0aW9uL3NlZWtpbmcgc3ltcGF0aHkpIjo8YnI+PHNwYW4gY2xhc3M9ImpwIj48cnVieT7poK08cnQ+44GC44Gf44G+PC9ydD48L3J1Ynk+44GMIDxydWJ5PueXmzxydD7jgYTjgZ88L3J0PjwvcnVieT48c3BhbiBjbGFzcz0iYmxhbmsiPj88L3NwYW4+44Gn44GZ44CCPC9zcGFuPg==",
    "answer": "44GE44KT",
    "choices": [
      "いん",
      "くん",
      "いの",
      "い"
    ],
    "correctNote": "PHNwYW4gY2xhc3M9ImpwIj7jgYQtYWRqIHBsYWluICsg44KT44Gn44GZPC9zcGFuPi4gPHNwYW4gY2xhc3M9ImpwIj7nl5vjgYQgKyDjgpPjgafjgZkg4oaSIOeXm+OBhOOCk+OBp+OBmTwvc3Bhbj4uIOOCkyBpcyBhIHNvdW5kLXNob3J0ZW5lZCDjga4u",
    "explain": "fuOCk+OBp+OBmSBhZGRzIGV4cGxhbmF0b3J5IG9yIGVtb3Rpb25hbCB3ZWlnaHQ6ICJ0aGUgcmVhc29uIGlzLi4uIiAvICJ5b3Ugc2VlLCAuLi4iLiBVc2VkIHRvIHNlZWsgdW5kZXJzdGFuZGluZyBvciBnaXZlIGNvbnRleHQu",
    "connect": "8J+UlyB+44KT44Gn44GZIGV2b2x2ZXM6IGl0IHJldHVybnMgaW4gQTIgTDkgKDxzcGFuIGNsYXNzPSJqcCI+fuOCk+OBp+OBmeOBizwvc3Bhbj4gc2Vla2luZyBleHBsYW5hdGlvbikuIFRoZSBwbGFpbiBmb3JtIGJlZm9yZSBpdCBtdXN0IE5FVkVSIGJlIOOBvuOBmS1mb3JtLg==",
    "warn": "4pqg77iPIDxzcGFuIGNsYXNzPSJqcCI+55eb44GE44Gn44GZIOOCk+OBp+OBmTwvc3Bhbj4g4pyXIOKAlCBuZXZlciBzdGFjayDjgafjgZkuIFRoZSBwbGFpbiBmb3JtIGF0dGFjaGVzIGRpcmVjdGx5IHRvIOOCky4="
  },
  {
    "lesson": 41,
    "type": "N4 · 文法1",
    "stem": "IkkgYXRlIHRvbyBtdWNoIjo8YnI+PHNwYW4gY2xhc3M9ImpwIj7jgY3jga7jgYYgPHJ1Ynk+6aOfPHJ0PuOBnzwvcnQ+PC9ydWJ5PuOBuTxzcGFuIGNsYXNzPSJibGFuayI+Pzwvc3Bhbj7jgb7jgZfjgZ/jgII8L3NwYW4+",
    "answer": "44GZ44GO",
    "choices": [
      "すぎ",
      "すぎる",
      "すぎて",
      "すぎない"
    ],
    "correctNote": "PHNwYW4gY2xhc3M9ImpwIj5WLeOBvuOBmTxydWJ5PuW9ojxydD7jgZHjgYQ8L3J0PjwvcnVieT4gKyDjgZnjgY7jgos8L3NwYW4+ID0gImRvIHRvbyBtdWNoLiIgPHNwYW4gY2xhc3M9ImpwIj7po5/jgbnjgb7jgZkg4oaSIOmjn+OBuSArIOOBmeOBjuOCiyDihpIg6aOf44G544GZ44GO44KLIOKGkiDpo5/jgbnjgZnjgY7jgb7jgZfjgZ88L3NwYW4+Lg==",
    "explain": "44GZ44GO44KLIGlzIGl0c2VsZiBhIEcyIHZlcmI6IDxzcGFuIGNsYXNzPSJqcCI+44GZ44GO44KLIOKGkiDjgZnjgY7jgb7jgZkg4oaSIOOBmeOBjiArIOOBvuOBl+OBnzwvc3Bhbj4uIEF0dGFjaCB0byDjgb7jgZktc3RlbSBvZiBhbnkgdmVyYiwgb3Ig44GELWFkaiBzdGVtICg8c3BhbiBjbGFzcz0ianAiPumrmOOBmeOBjuOCizwvc3Bhbj4pLCBvciDjgaotYWRqICg8c3BhbiBjbGFzcz0ianAiPuOBjeOCjOOBhOOBmeOBjuOCizwvc3Bhbj4pLg==",
    "connect": "8J+UlyDjgZnjgY7jgosgaXMgb25lIG9mIE40J3MgImNvbXBvdW5kIHZlcmIiIHBhdHRlcm5zLiBPdGhlcnM6IDxzcGFuIGNsYXNzPSJqcCI+fuOBr+OBmOOCgeOCiywgfuOBiuOCj+OCiywgfuOBpOOBpeOBkeOCizwvc3Bhbj4uIEFsbCBhdHRhY2ggdG8g44G+44GZLXN0ZW0u",
    "warn": "4pqg77iPIDxzcGFuIGNsYXNzPSJqcCI+6aOf44G544KL44GZ44GO44KLPC9zcGFuPiDinJcg4oCUIGRyb3Ag44G+44GZL+OCiyBiZWZvcmUgYXR0YWNoaW5nIOOBmeOBjuOCiy4="
  },
  {
    "lesson": 42,
    "type": "N4 · 文法2 ★",
    "stem": "QnVpbGQgdGhlIHNlbnRlbmNlIGJ5IG9yZGVyaW5nIHRoZSA0IGZyYWdtZW50cy4gV2hpY2ggd29yZCBnb2VzIGluIHRoZSDimIUgcG9zaXRpb24/PGJyPjxicj48c3BhbiBjbGFzcz0ianAiPjxydWJ5PuS8kTxydD7jgoTjgZk8L3J0PjwvcnVieT7jgb/jga48cnVieT7ml6U8cnQ+44GyPC9ydD48L3J1Ynk+44GvIDxzcGFuIGNsYXNzPSJibGFuayI+4pGgPC9zcGFuPiA8c3BhbiBjbGFzcz0iYmxhbmsiPuKYhTwvc3Bhbj4gPHNwYW4gY2xhc3M9ImJsYW5rIj7ikaI8L3NwYW4+IDxzcGFuIGNsYXNzPSJibGFuayI+4pGjPC9zcGFuPiDjgZfjgb7jgZnjgII8L3NwYW4+PGJyPjxicj5Xb3JkIGJhbms6IDxzcGFuIGNsYXNzPSJqcCI+PHJ1Ynk+6KaLPHJ0PuOBvzwvcnQ+PC9ydWJ5PuOBn+OCiiDCtyA8cnVieT7mnKw8cnQ+44G744KTPC9ydD48L3J1Ynk+44KSIMK3IOODhuODrOODk+OCkiDCtyA8cnVieT7oqq08cnQ+44KIPC9ydD48L3J1Ynk+44KT44Gg44KKPC9zcGFuPg==",
    "answer": "6Kqt44KT44Gg44KK",
    "choices": [
      "本を",
      "読んだり",
      "テレビを",
      "見たり"
    ],
    "correctNote": "4piFIHBvc2l0aW9uIChzbG90IDIpID0gPHNwYW4gY2xhc3M9ImpwIj7oqq3jgpPjgaDjgoo8L3NwYW4+LiBCdWlsdDogPHNwYW4gY2xhc3M9ImpwIj7kvJHjgb/jga7ml6Xjga8gPHN0cm9uZz7mnKzjgpIg6Kqt44KT44Gg44KKIOODhuODrOODk+OCkiDopovjgZ/jgoo8L3N0cm9uZz4g44GX44G+44GZ44CCPC9zcGFuPg==",
    "explain": "PHNwYW4gY2xhc3M9ImpwIj5W4oKBLeOBn+OCiuOAgSBW4oKCLeOBn+OCiiDjgZnjgos8L3NwYW4+ID0gbGlzdCBvZiByZXByZXNlbnRhdGl2ZSBleGFtcGxlIGFjdGlvbnMuIEVhY2ggW29iamVjdF1bVi3jgZ/jgopdIHBhaXIgc3RheXMgdG9nZXRoZXIuIEJvdGggdmVyYnMgaW4gcGFzdC1mb3JtLWJhc2UgKyDjgoo7IGVuZGluZyB2ZXJiIGlzIOOBmeOCiy4=",
    "connect": "8J+UlyBGaXJzdCBpbnRyb2R1Y2VkIGluIE41IEwxOS4gRG9uJ3QgY29uZnVzZSB3aXRoIDxzcGFuIGNsYXNzPSJqcCI+fuOBn+OCiTwvc3Bhbj4gKEwyNSwgY29uZGl0aW9uYWwpLiBPbmUg44KJLCB0d28g44O844KKIQ==",
    "warn": "4pqg77iPIEFsd2F5cyBlbmQgd2l0aCDjgZnjgosv44GX44G+44GZIOKAlCA8c3BhbiBjbGFzcz0ianAiPn7jgZ/jgop+44Gf44KKIOmjn+OBueOBvuOBl+OBnzwvc3Bhbj4g4pyXIOKGkiA8c3BhbiBjbGFzcz0ianAiPn7jgZ/jgop+44Gf44KKIOOBl+OBvuOBl+OBnzwvc3Bhbj4g4pyTLg=="
  },
  {
    "lesson": 43,
    "type": "N4 · 文法1",
    "stem": "IkknbGwgY2FycnkgdGhlIGx1Z2dhZ2UgZm9yIHlvdSI6PGJyPjxzcGFuIGNsYXNzPSJqcCI+44KP44Gf44GX44GMIDxydWJ5PuiNt+eJqTxydD7jgavjgoLjgaQ8L3J0PjwvcnVieT7jgpIgPHJ1Ynk+5oyBPHJ0PuOCgjwvcnQ+PC9ydWJ5PuOBo+OBpiA8c3BhbiBjbGFzcz0iYmxhbmsiPj88L3NwYW4+44CCPC9zcGFuPg==",
    "answer": "44GC44GS44G+44GZ",
    "choices": [
      "あげます",
      "くれます",
      "もらいます",
      "います"
    ],
    "correctNote": "PHNwYW4gY2xhc3M9ImpwIj5+44Gm44GC44GS44G+44GZPC9zcGFuPiA9ICJJIHdpbGwgZG8gKGZhdm9yKSBmb3IgeW91LiIgVGhlIHNwZWFrZXIgZG9lcyB0aGUgYWN0aW9uIEZPUiBzb21lb25lIGVsc2UncyBiZW5lZml0Lg==",
    "explain": "VGhlIE40IEwxOCBnaXZpbmcgdHJpbzogPHNwYW4gY2xhc3M9ImpwIj5+44Gm44GC44GS44KLPC9zcGFuPiAoSSBkbyBmb3Igc29tZW9uZSksIDxzcGFuIGNsYXNzPSJqcCI+fuOBpuOCguOCieOBhjwvc3Bhbj4gKEkgcmVjZWl2ZSBhIGZhdm9yKSwgPHNwYW4gY2xhc3M9ImpwIj5+44Gm44GP44KM44KLPC9zcGFuPiAoc29tZW9uZSBkb2VzIGZvciBtZSkuIERpcmVjdGlvbiBvZiB0aGUgZmF2b3IgbWF0dGVycyE=",
    "connect": "8J+UlyBUaGlzIHRyaW8gRVhQQU5EUyBhY3Jvc3MgTjUgTDI0LCBONCBMMTgsIGFuZCBBMiBMMTgg4oCUIHRocmVlIGxheWVycyBvZiA8c3BhbiBjbGFzcz0ianAiPuOBguOBkuOCiy/jgY/jgozjgosv44KC44KJ44GGPC9zcGFuPi4gRGlyZWN0aW9uIGFsd2F5cyBkZXRlcm1pbmVzIHdoaWNoIHZlcmI6IDxlbT5JIOKGkiB5b3U8L2VtPiA9IOOBguOBkuOCiywgPGVtPnlvdSDihpIgbWU8L2VtPiA9IOOBj+OCjOOCiywgPGVtPkkgcmVjZWl2ZTwvZW0+ID0g44KC44KJ44GGLg==",
    "warn": "4pqg77iPIDxzcGFuIGNsYXNzPSJqcCI+fuOBpuOBguOBkuOBvuOBmTwvc3Bhbj4gY2FuIHNvdW5kIGNvbmRlc2NlbmRpbmcgdG8gYSBzdXBlcmlvciDigJQgdXNlIHdpdGggZXF1YWxzIG9yIHRob3NlIHlvdW5nZXIvbG93ZXIgaW4gc3RhdHVzLiBGb3IgYSBib3NzLCBvZmZlciB0aGUgYWN0aW9uIGRpZmZlcmVudGx5Lg=="
  },
  {
    "lesson": 43,
    "type": "N4 · 文法1",
    "stem": "IkkgaGFkIG15IGZyaWVuZCB0YWtlIGEgcGhvdG8gKGZvciBtZSkiOjxicj48c3BhbiBjbGFzcz0ianAiPuOCj+OBn+OBl+OBryA8cnVieT7lj4s8cnQ+44Go44KCPC9ydD48L3J1Ynk+44Gg44GhPHNwYW4gY2xhc3M9ImJsYW5rIj4/PC9zcGFuPiDjgZfjgoPjgZfjgpPjgpIg44Go44Gj44GmIOOCguOCieOBhOOBvuOBl+OBn+OAgjwvc3Bhbj4=",
    "answer": "44Gr",
    "choices": [
      "に",
      "が",
      "から",
      "で"
    ],
    "correctNote": "PHNwYW4gY2xhc3M9ImpwIj5bcGVyc29uXSDjgasgKyBWLeOBpuOCguOCieOBhjwvc3Bhbj4gPSAiaGF2ZSBzb21lb25lIGRvIFYgZm9yIG1lLiIgVGhlIGZhdm9yLWRvZXIgdGFrZXMg44GrLg==",
    "explain": "RGlyZWN0aW9uOiBJIGFza2VkLCBmcmllbmQgZGlkIGl0IGZvciBtZSwgSSByZWNlaXZlIHRoZSBmYXZvciDihpIg44KC44KJ44GGLiBUaGUgZnJpZW5kIGlzIG1hcmtlZCB3aXRoIOOBqy4=",
    "connect": "8J+UlyBUaGUgYmlnIHRyaW8gYWNyb3NzIE41IEwyNCwgTjQgTDE4LCBBMiBMMTg6IDxzcGFuIGNsYXNzPSJqcCI+44GC44GS44KLL+OBj+OCjOOCiy/jgoLjgonjgYY8L3NwYW4+IGF0IHRocmVlIGxheWVycy4gPGVtPkkg4oaSIHlvdTwvZW0+ID0g44GC44GS44KLLCA8ZW0+eW91IOKGkiBtZTwvZW0+ID0g44GP44KM44KLLCA8ZW0+SSByZWNlaXZlPC9lbT4gPSDjgoLjgonjgYYu",
    "warn": "4pqg77iPIDxzcGFuIGNsYXNzPSJqcCI+44GMPC9zcGFuPiB3b3VsZCBjaGFuZ2UgdGhlIG1lYW5pbmcg4oCUIGxvc2luZyB0aGUgZmF2b3IgZnJhbWluZy4="
  },
  {
    "lesson": 44,
    "type": "A2 · 文法1",
    "stem": "IkkganVzdCBhdGUgKGEgbW9tZW50IGFnbykiOjxicj48c3BhbiBjbGFzcz0ianAiPuOBlOOBr+OCk+OCkiA8cnVieT7po588cnQ+44GfPC9ydD48L3J1Ynk+44G544GfIDxzcGFuIGNsYXNzPSJibGFuayI+Pzwvc3Bhbj7jgafjgZnjgII8L3NwYW4+",
    "answer": "44Gw44GL44KK",
    "choices": [
      "ばかり",
      "ところ",
      "あと",
      "まえ"
    ],
    "correctNote": "PHNwYW4gY2xhc3M9ImpwIj5WLeOBnyArIOOBsOOBi+OCiuOBp+OBmTwvc3Bhbj4gPSAianVzdCAocmVjZW50bHkpIGRpZCBWLiIgU1VCSkVDVElWRSByZWNlbmN5IOKAlCBjb3VsZCBiZSBtaW51dGVzIG9yIGV2ZW4geWVhcnMgZm9yIG1ham9yIGV2ZW50cy4=",
    "explain": "Q29tcGFyZSB3aXRoIDxzcGFuIGNsYXNzPSJqcCI+Vi3jgZ/jgajjgZPjgo3jgafjgZk8L3NwYW4+IChBMiBMNSkgPSAianVzdCBmaW5pc2hlZC4iIOOBqOOBk+OCjSBpcyBPQkpFQ1RJVkVMWSByZWNlbnQsIOOBsOOBi+OCiiBpcyBTVUJKRUNUSVZFTFkgcmVjZW50Lg==",
    "connect": "8J+UlyDjgbDjgYvjgoogaGFzIGFub3RoZXIgbGF0ZXIgbWVhbmluZzogPHNwYW4gY2xhc3M9ImpwIj5OICsg44Gw44GL44KKPC9zcGFuPiA9ICJvbmx5IC8gbm90aGluZyBidXQiIChtb3JlIGFkdmFuY2VkKS4gVGhlIEwxIHVzZSBpcyB0aGUgdGltZS1yZWNlbmN5IG9uZS4=",
    "warn": "4pqg77iPIDxzcGFuIGNsYXNzPSJqcCI+6aOf44G544KLIOOBsOOBi+OCijwvc3Bhbj4g4pyXIOKAlCBtdXN0IHVzZSBWLeOBnyBmb3JtLiBDb21wbGV0aW9uIGlzIHBhcnQgb2YgdGhlIG1lYW5pbmcu"
  },
  {
    "lesson": 45,
    "type": "A2 · 文法2 ★",
    "stem": "QnVpbGQgdGhlIHNlbnRlbmNlIGJ5IG9yZGVyaW5nIHRoZSA0IGZyYWdtZW50cy4gV2hpY2ggd29yZCBnb2VzIGluIHRoZSDimIUgcG9zaXRpb24/PGJyPjxicj48c3BhbiBjbGFzcz0ianAiPuOBguOBriA8cnVieT7lupc8cnQ+44G/44GbPC9ydD48L3J1Ynk+44GvIDxzcGFuIGNsYXNzPSJibGFuayI+4pGgPC9zcGFuPiA8c3BhbiBjbGFzcz0iYmxhbmsiPuKRoTwvc3Bhbj4gPHNwYW4gY2xhc3M9ImJsYW5rIj7imIU8L3NwYW4+IDxzcGFuIGNsYXNzPSJibGFuayI+4pGjPC9zcGFuPiDjgafjgZnjgII8L3NwYW4+PGJyPjxicj5Xb3JkIGJhbms6IDxzcGFuIGNsYXNzPSJqcCI+44GK44GE44GX44GEIMK3IDxydWJ5PuaWmeeQhjxydD7jgorjgofjgYbjgoo8L3J0PjwvcnVieT7jgYwgwrcg44GXIMK3IDxydWJ5PuWuiTxydD7jgoTjgZk8L3J0PjwvcnVieT7jgYQ8L3NwYW4+",
    "answer": "44GX",
    "choices": [
      "料理が",
      "安い",
      "し",
      "おいしい"
    ],
    "correctNote": "4piFIHBvc2l0aW9uIChzbG90IDMpID0gPHNwYW4gY2xhc3M9ImpwIj7jgZc8L3NwYW4+LiBCdWlsdDogPHNwYW4gY2xhc3M9ImpwIj7jgYLjga4g5bqX44GvIDxzdHJvbmc+5paZ55CG44GMIOWuieOBhCDjgZcg44GK44GE44GX44GEPC9zdHJvbmc+IOOBp+OBmeOAgjwvc3Bhbj4=",
    "explain": "PHNwYW4gY2xhc3M9ImpwIj5+44GX44CBIH7jgZfjgIF+PC9zcGFuPiBzdGFja3MgcmVhc29ucyAvIHF1YWxpdGllcy4gU3Ryb25nZXIgYW5kIG1vcmUgZW1vdGl2ZSB0aGFuIGp1c3QgfuOBi+OCiS4gRWFjaCA8c3BhbiBjbGFzcz0ianAiPlthZGpdIOOBlzwvc3Bhbj4gaXMgYSBjb21wbGV0ZSByZWFzb24tdW5pdC4=",
    "connect": "8J+UlyBDb21wYXJlIHdpdGggTjUgTDkgPHNwYW4gY2xhc3M9ImpwIj5+44GL44KJ44CBfjwvc3Bhbj4gKHNpbmdsZSByZWFzb24pIGFuZCBBMiBMMyA8c3BhbiBjbGFzcz0ianAiPn7jga7jgafjgIF+PC9zcGFuPiAoc29mdGVyIHJlYXNvbikuIOOBlyBpcyBmb3IgU1RBQ0tJTkcgcmVhc29ucy4=",
    "warn": "4pqg77iPIFVzZSBwbGFpbiBmb3JtIGJlZm9yZSDjgZc6IDxzcGFuIGNsYXNzPSJqcCI+5a6J44GE44Gn44GZIOOBlzwvc3Bhbj4gc291bmRzIHRvbyBmb3JtYWwgbWlkLXNlbnRlbmNlOyBwbGFpbiA8c3BhbiBjbGFzcz0ianAiPuWuieOBhCDjgZc8L3NwYW4+IGlzIHRoZSBuYXR1cmFsIGZpdC4="
  },
  {
    "lesson": 46,
    "type": "A2 · 文法1",
    "stem": "IkJlY2F1c2UgSSBoYXZlIGEgY29sZCwgSSB3b24ndCBnbyB0byBzY2hvb2wiOjxicj48c3BhbiBjbGFzcz0ianAiPuOBi+OBnOOCkiDjgbLjgYTjgZ88c3BhbiBjbGFzcz0iYmxhbmsiPj88L3NwYW4+44CBPHJ1Ynk+5a2m5qChPHJ0PuOBjOOBo+OBk+OBhjwvcnQ+PC9ydWJ5PuOCkiA8cnVieT7kvJE8cnQ+44KE44GZPC9ydD48L3J1Ynk+44G/44G+44GZ44CCPC9zcGFuPg==",
    "answer": "44Gu44Gn",
    "choices": [
      "ので",
      "から",
      "けど",
      "のに"
    ],
    "correctNote": "PHNwYW4gY2xhc3M9ImpwIj5bcGxhaW4gZm9ybV0gKyDjga7jgac8L3NwYW4+ID0gImJlY2F1c2UgKG9iamVjdGl2ZSkgfi4iIFNvZnRlciBhbmQgbW9yZSBwb2xpdGUgdGhhbiB+44GL44KJLg==",
    "explain": "fuOBi+OCiSBpcyBtb3JlIGRpcmVjdC9zcGVha2VyLWRyaXZlbjsgfuOBruOBpyBmZWVscyBvYmplY3RpdmUgYW5kIGdlbnRsZS4gSW4gcmVxdWVzdHMvZXhjdXNlcywgfuOBruOBpyBzb3VuZHMgbW9yZSBwb2xpdGUu",
    "connect": "8J+UlyBSZWFzb24gZmFtaWx5OiA8c3BhbiBjbGFzcz0ianAiPn7jgYvjgok8L3NwYW4+IChONSBMOSDigJQgZGlyZWN0KSwgPHNwYW4gY2xhc3M9ImpwIj5+44Gu44GnPC9zcGFuPiAoQTIgTDMg4oCUIHBvbGl0ZS9vYmplY3RpdmUpLCA8c3BhbiBjbGFzcz0ianAiPn7jgZc8L3NwYW4+IChBMiBMMiDigJQgc3RhY2tlZCku",
    "warn": "4pqg77iPIE5vdW4v44GqLWFkaiBiZWZvcmUg44Gu44GnIHVzZXMg44GqOiA8c3BhbiBjbGFzcz0ianAiPuOBjeOCjOOBhOOBquOBruOBpzwvc3Bhbj4sIDxzcGFuIGNsYXNzPSJqcCI+5a2m55Sf44Gq44Gu44GnPC9zcGFuPi4gTk9UIOOBoOOBruOBpy4="
  },
  {
    "lesson": 47,
    "type": "A2 · 文法1",
    "stem": "IklmICh5b3UgbWVhbikgVG9reW8sIFNoaWJ1eWEgaXMgZmFtb3VzIjo8YnI+PHNwYW4gY2xhc3M9ImpwIj48cnVieT7mnbHkuqw8cnQ+44Go44GG44GN44KH44GGPC9ydD48L3J1Ynk+PHNwYW4gY2xhc3M9ImJsYW5rIj4/PC9zcGFuPuOAgSDjgZfjgbbjgoTjgYwgPHJ1Ynk+5pyJ5ZCNPHJ0PuOChuOBhuOCgeOBhDwvcnQ+PC9ydWJ5PuOBp+OBmeOAgjwvc3Bhbj4=",
    "answer": "44Gq44KJ",
    "choices": [
      "なら",
      "たら",
      "ば",
      "と"
    ],
    "correctNote": "PHNwYW4gY2xhc3M9ImpwIj5OICsg44Gq44KJPC9zcGFuPiA9ICJpbiB0aGF0IGNhc2UgLyBpZiB5b3UgbWVhbiBOLiIgUGlja3MgdXAgdGhlIGxpc3RlbmVyJ3MgdG9waWMgYW5kIGdpdmVzIGFkdmljZS4=",
    "explain": "44Gq44KJIGlzIHVuaXF1ZTogaXQgY29uZGl0aW9ucyBvbiB3aGF0IHRoZSBMSVNURU5FUiBqdXN0IHNhaWQuIH7jgZ/jgokgY29uZGl0aW9ucyBvbiBhIGdlbmVyaWMgc2l0dWF0aW9uLiB+44GoIG9uIGEgbmF0dXJhbCBjYXVzZS4=",
    "connect": "8J+UlyBUaGUgY29uZGl0aW9uYWwgZmFtaWx5IGNvbXBsZXRlcyBoZXJlOiA8c3BhbiBjbGFzcz0ianAiPn7jgag8L3NwYW4+IChONCBMMTMpIOKGkiA8c3BhbiBjbGFzcz0ianAiPn7jgZ/jgok8L3NwYW4+IChONSBMMjUpIOKGkiA8c3BhbiBjbGFzcz0ianAiPn7jgbA8L3NwYW4+IChBMiBMMTApIOKGkiA8c3BhbiBjbGFzcz0ianAiPn7jgarjgok8L3NwYW4+ICh0aGlzIGxlc3Nvbiku",
    "warn": "4pqg77iPIDxzcGFuIGNsYXNzPSJqcCI+5p2x5Lqs44Gf44KJPC9zcGFuPiDinJcg4oCUIOOBn+OCiSBhdHRhY2hlcyBvbmx5IHRvIHZlcmJzL2FkamVjdGl2ZXMuIOOBquOCiSBpcyB0aGUgbm91bi1jb25kaXRpb25hbC4="
  },
  {
    "lesson": 48,
    "type": "A2 · 文法1",
    "stem": "UG90ZW50aWFsIGZvcm0gb2YgPHNwYW4gY2xhc3M9ImpwIj7po5/jgbnjgos8L3NwYW4+Og==",
    "answer": "6aOf44G544KJ44KM44KL",
    "choices": [
      "食べられる",
      "食べれる",
      "食べることが できる",
      "食べさせる"
    ],
    "correctNote": "R3JvdXAgSUkgdmVyYnM6IHJlcGxhY2UgPHNwYW4gY2xhc3M9ImpwIj7jgosg4oaSIOOCieOCjOOCizwvc3Bhbj4uIDxzcGFuIGNsYXNzPSJqcCI+6aOf44G544KLIOKGkiDpo5/jgbnjgonjgozjgos8L3NwYW4+ID0gImNhbiBlYXQuIg==",
    "explain": "VGhyZWUgZ3JvdXBzOiBHMSDjgYbihpLjgYgtcm93ICsg44KLICg8c3BhbiBjbGFzcz0ianAiPuOBruOCgOKGkuOBruOCgeOCizwvc3Bhbj4pOyBHMiDjgovihpLjgonjgozjgos7IEczIOOBmeOCi+KGkuOBp+OBjeOCiywg44GP44KL4oaS44GT44KJ44KM44KLLiBDYXN1YWwgSmFwYW5lc2UgZHJvcHMg44KJICg8c3BhbiBjbGFzcz0ianAiPumjn+OBueOCjOOCizwvc3Bhbj4pIOKAlCBidXQgc3RhbmRhcmQgaXMg44KJ44KM44KLLg==",
    "connect": "8J+UlyBSZXBsYWNlcyBONSBMMTgncyA8c3BhbiBjbGFzcz0ianAiPn7jgZPjgajjgYzjgafjgY3jgos8L3NwYW4+LiBCb3RoIGNvcnJlY3Q7IHBvdGVudGlhbCBmb3JtIGlzIG1vcmUgbmF0dXJhbC4=",
    "warn": "4pqg77iPIEcyIHBvdGVudGlhbCA8c3BhbiBjbGFzcz0ianAiPn7jgonjgozjgos8L3NwYW4+IGxvb2tzIElERU5USUNBTCB0byBwYXNzaXZlIDxzcGFuIGNsYXNzPSJqcCI+fuOCieOCjOOCizwvc3Bhbj4gKEEyIEw3KS4gQ29udGV4dCBkaXNhbWJpZ3VhdGVzIQ=="
  },
  {
    "lesson": 50,
    "type": "A2 · 文法2 ★",
    "stem": "QnVpbGQgdGhlIHNlbnRlbmNlIGJ5IG9yZGVyaW5nIHRoZSA0IGZyYWdtZW50cy4gV2hpY2ggd29yZCBnb2VzIGluIHRoZSDimIUgcG9zaXRpb24/PGJyPjxicj48c3BhbiBjbGFzcz0ianAiPjxydWJ5PuWniTxydD7jgYLjga08L3J0PjwvcnVieT7jga8gPHNwYW4gY2xhc3M9ImJsYW5rIj7ikaA8L3NwYW4+IDxzcGFuIGNsYXNzPSJibGFuayI+4piFPC9zcGFuPiA8c3BhbiBjbGFzcz0iYmxhbmsiPuKRojwvc3Bhbj4gPHNwYW4gY2xhc3M9ImJsYW5rIj7ikaM8L3NwYW4+IDxydWJ5PumjsjxydD7jga48L3J0PjwvcnVieT7jgb7jgozjgb7jgZfjgZ/jgII8L3NwYW4+PGJyPjxicj5Xb3JkIGJhbms6IDxzcGFuIGNsYXNzPSJqcCI+44K444Ol44O844K5IMK3IOOCkiDCtyA8cnVieT7lvJ88cnQ+44GK44Go44GG44GoPC9ydD48L3J1Ynk+IMK3IOOBqzwvc3Bhbj4=",
    "answer": "44Gr",
    "choices": [
      "弟",
      "に",
      "ジュース",
      "を"
    ],
    "correctNote": "4piFIHBvc2l0aW9uIChzbG90IDIpID0gPHNwYW4gY2xhc3M9ImpwIj7jgas8L3NwYW4+LiBCdWlsdDogPHNwYW4gY2xhc3M9ImpwIj7lp4njga8gPHN0cm9uZz7lvJ8g44GrIOOCuOODpeODvOOCuSDjgpI8L3N0cm9uZz4g6aOy44G+44KM44G+44GX44Gf44CCPC9zcGFuPg==",
    "explain": "UGFzc2l2ZSBwYXR0ZXJuOiA8c3BhbiBjbGFzcz0ianAiPlt2aWN0aW1dIOOBryBbYWdlbnRdIOOBqyBbdGhpbmcgYWZmZWN0ZWRdIOOCkiBWLSjjgokp44KM44KLPC9zcGFuPi4gVGhlIGFnZW50IChvbmUgcGVyZm9ybWluZyB0aGUgYWN0aW9uKSBpcyBtYXJrZWQgd2l0aCDjgasu",
    "connect": "8J+UlyBUaGUgZm9ybSA8c3BhbiBjbGFzcz0ianAiPn7jgonjgozjgos8L3NwYW4+IHNlcnZlcyBUSFJFRSByb2xlczogcG90ZW50aWFsIChBMiBMNSksIHBhc3NpdmUgKEEyIEw3KSwgaG9ub3JpZmljIChsYXRlcikuIFNhbWUgc2hhcGUsIHRocmVlIG1lYW5pbmdzLg==",
    "warn": "4pqg77iPIFBhc3NpdmUgPHNwYW4gY2xhc3M9ImpwIj7po7Ljgb7jgozjgos8L3NwYW4+IHVzZXMgdGhlIFNBTUUgZW5kaW5nIGFzIHBvdGVudGlhbCA8c3BhbiBjbGFzcz0ianAiPumjn+OBueOCieOCjOOCizwvc3Bhbj4uIFRoZSDjgasgbWFya2luZyB0aGUgYWdlbnQgaXMgd2hhdCB0ZWxscyB5b3UgaXQncyBwYXNzaXZlLg=="
  },
  {
    "lesson": 52,
    "type": "A2 · 文法1",
    "stem": "Ikkgb25seSBoYXZlIDEwMCB5ZW4iOjxicj48c3BhbiBjbGFzcz0ianAiPjEwMDxydWJ5PuWGhjxydD7jgYjjgpM8L3J0PjwvcnVieT48c3BhbiBjbGFzcz0iYmxhbmsiPj88L3NwYW4+IOOBguOCiuOBvuOBm+OCk+OAgjwvc3Bhbj4=",
    "answer": "44GX44GL",
    "choices": [
      "しか",
      "だけ",
      "も",
      "ばかり"
    ],
    "correctNote": "PHNwYW4gY2xhc3M9ImpwIj5OIOOBl+OBiyArIOWQpuWumjxydWJ5PuW9ojxydD7jgZHjgYQ8L3J0PjwvcnVieT48L3NwYW4+ID0gIm9ubHkgTiAobm90IG1vcmUpLiIgQWx3YXlzIHBhaXJlZCB3aXRoIE5FR0FUSVZFIHZlcmIu",
    "explain": "Q29tcGFyZTogPHNwYW4gY2xhc3M9ImpwIj4xMDDlhoYg44Gg44GRIOOBguOCiuOBvuOBmTwvc3Bhbj4gKG5ldXRyYWwgIkkgaGF2ZSBqdXN0IDEwMCB5ZW4iKSB2cy4gPHNwYW4gY2xhc3M9ImpwIj4xMDDlhoYg44GX44GLIOOBguOCiuOBvuOBm+OCkzwvc3Bhbj4gKCJPTkxZIDEwMCB5ZW4iIOKAlCBpbXBsaWVzIGRpc2FwcG9pbnRtZW50KS4=",
    "connect": "8J+UlyDjgaDjgZEgKyBwb3NpdGl2ZSA9IG5ldXRyYWwgIm9ubHkuIiDjgZfjgYsgKyBuZWdhdGl2ZSA9IGVtcGhhdGljL3JlZ3JldGZ1bCAib25seSAvIG5vdGhpbmcgYnV0LiIgU2FtZSBtZWFuaW5nLCBkaWZmZXJlbnQgZmVlbGluZy4=",
    "warn": "4pqg77iPIDxzcGFuIGNsYXNzPSJqcCI+MTAw5YaGIOOBl+OBiyDjgYLjgorjgb7jgZk8L3NwYW4+IOKclyDigJQg44GX44GLIFJFUVVJUkVTIG5lZ2F0aXZlLg=="
  },
  {
    "lesson": 53,
    "type": "A2 · 文法2 ★",
    "stem": "QnVpbGQgdGhlIHNlbnRlbmNlIGJ5IG9yZGVyaW5nIHRoZSA0IGZyYWdtZW50cy4gV2hpY2ggd29yZCBnb2VzIGluIHRoZSDimIUgcG9zaXRpb24/PGJyPjxicj48c3BhbiBjbGFzcz0ianAiPuOCj+OBn+OBl+OBryA8c3BhbiBjbGFzcz0iYmxhbmsiPuKRoDwvc3Bhbj4gPHNwYW4gY2xhc3M9ImJsYW5rIj7ikaE8L3NwYW4+IDxzcGFuIGNsYXNzPSJibGFuayI+4piFPC9zcGFuPiA8c3BhbiBjbGFzcz0iYmxhbmsiPuKRozwvc3Bhbj4gPHJ1Ynk+57e057+SPHJ0PuOCjOOCk+OBl+OCheOBhjwvcnQ+PC9ydWJ5PuOBl+OBvuOBmeOAgjwvc3Bhbj48YnI+PGJyPldvcmQgYmFuazogPHNwYW4gY2xhc3M9ImpwIj7jgojjgYbjgasgwrcgPHJ1Ynk+5LiK5omLPHJ0PuOBmOOCh+OBhuOBmjwvcnQ+PC9ydWJ5PuOBqyDCtyDjg5TjgqLjg47jgYwgwrcg44Gq44KLPC9zcGFuPg==",
    "answer": "44Gq44KL",
    "choices": [
      "ピアノが",
      "上手に",
      "なる",
      "ように"
    ],
    "correctNote": "4piFIHBvc2l0aW9uIChzbG90IDMpID0gPHNwYW4gY2xhc3M9ImpwIj7jgarjgos8L3NwYW4+LiBCdWlsdDogPHNwYW4gY2xhc3M9ImpwIj7jgo/jgZ/jgZfjga8gPHN0cm9uZz7jg5TjgqLjg47jgYwg5LiK5omL44GrIOOBquOCiyDjgojjgYbjgas8L3N0cm9uZz4g57e057+S44GX44G+44GZ44CCPC9zcGFuPg==",
    "explain": "PHNwYW4gY2xhc3M9ImpwIj5bZ29hbC1jbGF1c2UgcGxhaW5dIOOCiOOBhuOBq+OAgSBbZWZmb3J0LWNsYXVzZV08L3NwYW4+ID0gImluIG9yZGVyIHRvIC8gc28gdGhhdCB+LiIgVGhlIHZlcmIgaW4gdGhlIGdvYWwtY2xhdXNlIGlzIGluIERJQ1RJT05BUlkgZm9ybSAoPHNwYW4gY2xhc3M9ImpwIj7jgarjgos8L3NwYW4+KSwgc2l0dGluZyByaWdodCBiZWZvcmUg44KI44GG44GrLg==",
    "connect": "8J+UlyBDb21wYXJlIHdpdGggPHNwYW4gY2xhc3M9ImpwIj5+44Gf44KB44GrPC9zcGFuPiAoQTIgTDE4KSBmb3Igdm9saXRpb25hbCBwdXJwb3Nlcy4g44KI44GG44GrID0gd2lzaCBmb3IgY2hhbmdlICh1bmNvbnRyb2xsYWJsZSk7IOOBn+OCgeOBqyA9IGRpcmVjdCBkZWxpYmVyYXRlIGFjdGlvbi4=",
    "warn": "4pqg77iPIH7jgojjgYbjgasgZ29lcyBhZnRlciBQTEFJTiBmb3JtLCBuZXZlciBhZnRlciDjgb7jgZktc3RlbS4="
  },
  {
    "lesson": 54,
    "type": "A2 · 文法1",
    "stem": "Ikl0IG1pZ2h0IHJhaW4gdG9tb3Jyb3ciOjxicj48c3BhbiBjbGFzcz0ianAiPuOBguOBl+OBnyA8cnVieT7pm6g8cnQ+44GC44KBPC9ydD48L3J1Ynk+44GMIDxzcGFuIGNsYXNzPSJibGFuayI+Pzwvc3Bhbj7jgII8L3NwYW4+",
    "answer": "44G144KL44GL44KC44GX44KM44G+44Gb44KT",
    "choices": [
      "ふるかもしれません",
      "ふるでしょう",
      "ふるそうです",
      "ふるはずです"
    ],
    "correctNote": "PHNwYW4gY2xhc3M9ImpwIj5bcGxhaW4gZm9ybV0gKyDjgYvjgoLjgZfjgozjgb7jgZvjgpM8L3NwYW4+ID0gIm1pZ2h0IC8gbWF5IH4uIiBMb3dlciBjb25maWRlbmNlIHRoYW4g44Gn44GX44KH44GGLg==",
    "explain": "UHJvYmFiaWxpdHkgbGFkZGVyIChsb3cg4oaSIGhpZ2gpOiA8c3BhbiBjbGFzcz0ianAiPn7jgYvjgoLjgZfjgozjgb7jgZvjgpM8L3NwYW4+IChtaWdodCAzMC01MCUpIOKGkiA8c3BhbiBjbGFzcz0ianAiPn7jgafjgZfjgofjgYY8L3NwYW4+IChwcm9iYWJseSA3MCUpIOKGkiA8c3BhbiBjbGFzcz0ianAiPn7jga/jgZrjgafjgZk8L3NwYW4+IChzaG91bGQgYmUgfjkwJSkg4oaSIDxzcGFuIGNsYXNzPSJqcCI+fuOBqzxydWJ5PumBlTxydD7jgaHjgYw8L3J0PjwvcnVieT7jgYTjgarjgYQ8L3NwYW4+IChtdXN0IGJlIDk1JSspLg==",
    "connect": "8J+UlyBONSBMMjEgaW50cm9kdWNlZCA8c3BhbiBjbGFzcz0ianAiPn7jgafjgZfjgofjgYY8L3NwYW4+LiBBMiBMMTEgYWRkcyDjgYvjgoLjgZfjgozjgb7jgZvjgpMgYXMgdGhlIGxvd2VyLWNvbmZpZGVuY2UgY291c2luLg==",
    "warn": "4pqg77iPIFVzZSBwbGFpbiBmb3JtIGJlZm9yZSDjgYvjgoLjgZfjgozjgb7jgZvjgpM6IDxzcGFuIGNsYXNzPSJqcCI+44G144KK44G+44GZIOOBi+OCguOBl+OCjOOBvuOBm+OCkzwvc3Bhbj4g4pyXIOKGkiA8c3BhbiBjbGFzcz0ianAiPuOBteOCiyDjgYvjgoLjgZfjgozjgb7jgZvjgpM8L3NwYW4+IOKcky4="
  },
  {
    "lesson": 61,
    "type": "A2 · 文法1",
    "stem": "IkkgYW0gc3R1ZHlpbmcgaW4gb3JkZXIgdG8gZ28gdG8gSmFwYW4iOjxicj48c3BhbiBjbGFzcz0ianAiPjxydWJ5PuaXpeacrDxydD7jgavjgbvjgpM8L3J0PjwvcnVieT7jgbggPHNwYW4gY2xhc3M9ImJsYW5rIj4/PC9zcGFuPiDjgZ/jgoHjgavjgIEgPHJ1Ynk+5YuJ5by3PHJ0PuOBueOCk+OBjeOCh+OBhjwvcnQ+PC9ydWJ5PuOBl+OBpiDjgYTjgb7jgZnjgII8L3NwYW4+",
    "answer": "6KGM44GP",
    "choices": [
      "行く",
      "行った",
      "行って",
      "行きます"
    ],
    "correctNote": "PHNwYW4gY2xhc3M9ImpwIj5WLei+nuabuOW9oiArIOOBn+OCgeOBqzwvc3Bhbj4gPSAiaW4gb3JkZXIgdG8gVi4iIFVzZWQgZm9yIFZPTElUSU9OQUwgZ29hbHMgKHdoZXJlIFlPVSBjb250cm9sIHRoZSBvdXRjb21lKS4=",
    "explain": "44Gf44KB44GrIHRha2VzIHBsYWluIERJQ1RJT05BUlkgZm9ybS4gVGhlIGFjdGlvbiDjgojjgYbjgasgdGFrZXMgaXMgbm9uLXZvbGl0aW9uYWwgY2hhbmdlIChiZWNvbWluZywgYmVpbmcgYWJsZSksIHdoaWxlIOOBn+OCgeOBqyB0YWtlcyBhIGRlbGliZXJhdGUsIGNvbnRyb2xsYWJsZSBhY3Rpb24u",
    "connect": "8J+UlyBUaGUgcHVycG9zZSBwYWlyOiA8c3BhbiBjbGFzcz0ianAiPn7jgZ/jgoHjgas8L3NwYW4+IChjb250cm9sbGFibGUgZ29hbCDigJQgQTIgTDE0LCBMMTgpIHZzIDxzcGFuIGNsYXNzPSJqcCI+fuOCiOOBhuOBqzwvc3Bhbj4gKHVuY29udHJvbGxhYmxlIGNoYW5nZSDigJQgQTIgTDEwKS4gT25lIG9mIEEyJ3MgbW9zdC10ZXN0ZWQgZGlzdGluY3Rpb25zLg==",
    "warn": "4pqg77iPIDxzcGFuIGNsYXNzPSJqcCI+6KGM44GN44G+44GZ44Gf44KB44GrPC9zcGFuPiDinJcg4oCUIG11c3QgYmUgcGxhaW4gZm9ybS4gPHNwYW4gY2xhc3M9ImpwIj7ooYzjgaPjgZ/jgZ/jgoHjgas8L3NwYW4+IOKJoCBwdXJwb3NlOyB0aGF0IG1lYW5zICJiZWNhdXNlIEkgd2VudCIgKGEgZGlmZmVyZW50IOOBn+OCgeOBqyEpLg=="
  }
];

  window.quizConfig = {
    lessonTitle: "JLPT N4 Grammar Mock Exam · 60 Questions",
    lessonTitleShort: "JLPT N4 Mock · 60 Q",
    badge: "JLPT N4 Grammar",
    subtitle: "Complete 60 Grammar practice items",
    emailSubject: "JLPT N4 Mock Exam",
    questions: processedQuestions
  };
})();