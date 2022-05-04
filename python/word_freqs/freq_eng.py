import json
from matplotlib import pyplot as plt
import numpy as np

lang='eng'

with open('eng_4words.json', 'r') as f:
    word_list = json.load(f)
words = [item['word'] for item in word_list]

with open('{}_4words.json'.format(lang), 'w', encoding='utf-8') as f:
    json.dump(words, f)

full = ''.join(words)
letterlist = list(full)
letters = list(set(letterlist))
count = []
for letter in letters:
    count.append(len([l for l in letterlist if l==letter]))

idx = sorted(range(len(count)), key=lambda k: count[k])

letters = np.array(letters)
count = np.array(count)
freqs = np.cumsum(100*count[idx] / np.sum(count))

dout = dict(zip(letters, [float(c) for c in freqs]))

discards = []

if lang=='ita':
    discards = list('xyjkw')
if lang=='pol':
    discards = list('xv')


[dout.pop(item) for item in discards]


with open('{}_4freqs.json'.format(lang), 'w', encoding='utf-8') as f:
    json.dump(dout, f, ensure_ascii=False)

fig, ax = plt.subplots()
ax.bar(letters[idx], 100*count[idx] / np.sum(count))
plt.show()

