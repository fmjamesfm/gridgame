
#%%
from enum import unique
import matplotlib.pyplot as plt 
import numpy as np
import json

lang = 'ita'
basename = '{}_4words'.format(lang)

# input word list (txt)
with open('{}_4words.txt'.format(lang), 'r', encoding='utf-8') as f:
    words = f.read().splitlines()

words = [w.lower().replace(" ","") for w in words]

# %%
with open('{}_4words.json'.format(lang), 'w', encoding='utf-8') as f:
    json.dump(words, f)

full = ''.join(words)
letterlist = list(full)
letters = list(set(letterlist))
count = []
for letter in letters:
    count.append(len([l for l in letterlist if l==letter]))

idx = sorted(range(len(count)), key=lambda k: count[k])


letters = np.array(letters)[idx]
count = np.array(count)[idx]


freqs = np.cumsum(100*count / np.sum(count))

dout = dict(zip(letters, [float(c) for c in freqs]))

discards = []

if lang=='ita':
    discards = list('xyjkw')
if lang=='pol':
    discards = list('xv')

print(dout['a'])
print(letters[-1], count[-1])

[dout.pop(item) for item in discards]

print(dout['a'])

with open('{}_4freqs.json'.format(lang), 'w', encoding='utf-8') as f:
    json.dump(dout, f, ensure_ascii=False)

print(dout)
fig, ax = plt.subplots()
ax.bar(letters, freqs)
plt.show()




# %%
