with open('slowa.txt', 'r', encoding='utf-8') as f:
    lines = f.readlines()


with open('output.txt', 'w', encoding='utf-8') as f:
    for line in lines:
        if len(line) == 5:
            f.write(line)



