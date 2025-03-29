// Examples of SysY code with pre-compiled outputs
const examples = {
    example1: {
        name: "Simple Function",
        code: `// Simple function that calculates factorial
int factorial(int n) {
    if (n == 0 || n == 1) {
        return 1;
    }
    return n * factorial(n - 1);
}

int main() {
    int result = factorial(5);
    putint(result);
    putch(10); // newline
    return 0;
}`,
        arm: {
            O0: `// ARM Assembly - No optimization (-O0)
.global factorial
factorial:
    push {fp, lr}
    add fp, sp, #4
    sub sp, sp, #8
    str r0, [fp, #-8]
    ldr r3, [fp, #-8]
    cmp r3, #0
    beq .L3
    ldr r3, [fp, #-8]
    cmp r3, #1
    bne .L4
.L3:
    mov r3, #1
    b .L5
.L4:
    ldr r3, [fp, #-8]
    sub r3, r3, #1
    mov r0, r3
    bl factorial
    mov r2, r0
    ldr r3, [fp, #-8]
    mul r3, r3, r2
.L5:
    mov r0, r3
    sub sp, fp, #4
    pop {fp, pc}

.global main
main:
    push {fp, lr}
    add fp, sp, #4
    sub sp, sp, #8
    mov r0, #5
    bl factorial
    str r0, [fp, #-8]
    ldr r0, [fp, #-8]
    bl putint
    mov r0, #10
    bl putch
    mov r3, #0
    mov r0, r3
    sub sp, fp, #4
    pop {fp, pc}`,
            
            O1: `// ARM Assembly - Basic optimization (-O1)
.global factorial
factorial:
    push {r4, lr}
    cmp r0, #1
    mov r4, r0
    ble .L3
    sub r0, r0, #1
    bl factorial
    mul r0, r4, r0
    pop {r4, pc}
.L3:
    mov r0, #1
    pop {r4, pc}

.global main
main:
    push {r4, lr}
    mov r0, #5
    bl factorial
    bl putint
    mov r0, #10
    bl putch
    mov r0, #0
    pop {r4, pc}`,
            
            O2: `// ARM Assembly - Aggressive optimization (-O2)
.global factorial
factorial:
    cmp r0, #0
    bxeq lr
    push {r4, lr}
    mov r4, r0
    sub r0, r0, #1
    bl factorial
    mul r0, r4, r0
    pop {r4, pc}

.global main
main:
    push {lr}
    mov r0, #120  @ Precomputed factorial(5) = 120
    bl putint
    mov r0, #10
    bl putch
    mov r0, #0
    pop {pc}`
        },
        riscv: {
            O0: `# RISC-V Assembly - No optimization (-O0)
factorial:
    addi sp, sp, -16
    sw ra, 12(sp)
    sw s0, 8(sp)
    addi s0, sp, 16
    sw a0, -12(s0)
    lw a5, -12(s0)
    beqz a5, .L3
    lw a4, -12(s0)
    li a5, 1
    bne a4, a5, .L4
.L3:
    li a5, 1
    j .L5
.L4:
    lw a5, -12(s0)
    addi a5, a5, -1
    mv a0, a5
    call factorial
    mv a5, a0
    lw a4, -12(s0)
    mul a5, a4, a5
.L5:
    mv a0, a5
    lw ra, 12(sp)
    lw s0, 8(sp)
    addi sp, sp, 16
    ret

main:
    addi sp, sp, -16
    sw ra, 12(sp)
    sw s0, 8(sp)
    addi s0, sp, 16
    li a0, 5
    call factorial
    sw a0, -12(s0)
    lw a0, -12(s0)
    call putint
    li a0, 10
    call putch
    li a5, 0
    mv a0, a5
    lw ra, 12(sp)
    lw s0, 8(sp)
    addi sp, sp, 16
    ret`,
            
            O1: `# RISC-V Assembly - Basic optimization (-O1)
factorial:
    addi sp, sp, -16
    sw ra, 12(sp)
    sw s0, 8(sp)
    mv s0, a0
    li a5, 1
    ble a0, a5, .L2
    addi a0, a0, -1
    call factorial
    mul a0, s0, a0
    j .L3
.L2:
    li a0, 1
.L3:
    lw ra, 12(sp)
    lw s0, 8(sp)
    addi sp, sp, 16
    ret

main:
    addi sp, sp, -16
    sw ra, 12(sp)
    li a0, 5
    call factorial
    call putint
    li a0, 10
    call putch
    li a0, 0
    lw ra, 12(sp)
    addi sp, sp, 16
    ret`,
            
            O2: `# RISC-V Assembly - Aggressive optimization (-O2)
factorial:
    beqz a0, .L4
    addi sp, sp, -16
    sw ra, 12(sp)
    sw s0, 8(sp)
    mv s0, a0
    addi a0, a0, -1
    call factorial
    mul a0, s0, a0
    lw ra, 12(sp)
    lw s0, 8(sp)
    addi sp, sp, 16
    ret
.L4:
    li a0, 1
    ret

main:
    addi sp, sp, -16
    sw ra, 12(sp)
    li a0, 120  # Precomputed factorial(5) = 120
    call putint
    li a0, 10
    call putch
    li a0, 0
    lw ra, 12(sp)
    addi sp, sp, 16
    ret`
        },
        llvm: {
            O0: `; LLVM IR - No optimization (-O0)
define i32 @factorial(i32 %n) {
entry:
  %n.addr = alloca i32, align 4
  %retval = alloca i32, align 4
  store i32 %n, i32* %n.addr, align 4
  %0 = load i32, i32* %n.addr, align 4
  %cmp = icmp eq i32 %0, 0
  br i1 %cmp, label %if.then, label %lor.lhs.false

lor.lhs.false:
  %1 = load i32, i32* %n.addr, align 4
  %cmp1 = icmp eq i32 %1, 1
  br i1 %cmp1, label %if.then, label %if.end

if.then:
  store i32 1, i32* %retval, align 4
  br label %return

if.end:
  %2 = load i32, i32* %n.addr, align 4
  %3 = load i32, i32* %n.addr, align 4
  %sub = sub nsw i32 %3, 1
  %call = call i32 @factorial(i32 %sub)
  %mul = mul nsw i32 %2, %call
  store i32 %mul, i32* %retval, align 4
  br label %return

return:
  %4 = load i32, i32* %retval, align 4
  ret i32 %4
}

define i32 @main() {
entry:
  %retval = alloca i32, align 4
  %result = alloca i32, align 4
  store i32 0, i32* %retval, align 4
  %call = call i32 @factorial(i32 5)
  store i32 %call, i32* %result, align 4
  %0 = load i32, i32* %result, align 4
  call void @putint(i32 %0)
  call void @putch(i32 10)
  ret i32 0
}

declare void @putint(i32)
declare void @putch(i32)`,
            
            O1: `; LLVM IR - Basic optimization (-O1)
define i32 @factorial(i32 %n) {
entry:
  %cmp = icmp ult i32 %n, 2
  br i1 %cmp, label %return, label %if.end

if.end:
  %sub = add nsw i32 %n, -1
  %call = call i32 @factorial(i32 %sub)
  %mul = mul nsw i32 %call, %n
  br label %return

return:
  %retval.0 = phi i32 [ %mul, %if.end ], [ 1, %entry ]
  ret i32 %retval.0
}

define i32 @main() {
entry:
  %call = call i32 @factorial(i32 5)
  call void @putint(i32 %call)
  call void @putch(i32 10)
  ret i32 0
}

declare void @putint(i32)
declare void @putch(i32)`,
            
            O2: `; LLVM IR - Aggressive optimization (-O2)
define i32 @factorial(i32 %n) {
entry:
  %cmp = icmp eq i32 %n, 0
  br i1 %cmp, label %return, label %if.end

if.end:
  %sub = add nsw i32 %n, -1
  %call = call i32 @factorial(i32 %sub)
  %mul = mul nsw i32 %call, %n
  ret i32 %mul

return:
  ret i32 1
}

define i32 @main() {
entry:
  call void @putint(i32 120)  ; Precomputed factorial(5) = 120
  call void @putch(i32 10)
  ret i32 0
}

declare void @putint(i32)
declare void @putch(i32)`
        }
    },
    
    example2: {
        name: "Array Manipulation",
        code: `// Array operations with bubble sort
void bubbleSort(int arr[], int n) {
    int i, j, temp;
    for (i = 0; i < n - 1; i++) {
        for (j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                // Swap arr[j] and arr[j+1]
                temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
}

int main() {
    int arr[5] = {64, 34, 25, 12, 22};
    int n = 5;
    int i;
    
    bubbleSort(arr, n);
    
    for (i = 0; i < n; i++) {
        putint(arr[i]);
        putch(32); // space
    }
    putch(10); // newline
    
    return 0;
}`,
        arm: {
            O0: `// ARM Assembly - Array example (-O0)
.global bubbleSort
bubbleSort:
    push {fp, lr}
    add fp, sp, #4
    sub sp, sp, #24
    str r0, [fp, #-24]
    str r1, [fp, #-28]
    mov r3, #0
    str r3, [fp, #-8]
    b .L2
.L6:
    mov r3, #0
    str r3, [fp, #-12]
    b .L3
.L5:
    ldr r3, [fp, #-12]
    lsl r3, r3, #2
    ldr r2, [fp, #-24]
    add r3, r2, r3
    ldr r2, [r3]
    ldr r3, [fp, #-12]
    add r3, r3, #1
    lsl r3, r3, #2
    ldr r1, [fp, #-24]
    add r3, r1, r3
    ldr r3, [r3]
    cmp r2, r3
    ble .L4
    ldr r3, [fp, #-12]
    lsl r3, r3, #2
    ldr r2, [fp, #-24]
    add r3, r2, r3
    ldr r3, [r3]
    str r3, [fp, #-16]
    ldr r3, [fp, #-12]
    add r3, r3, #1
    lsl r3, r3, #2
    ldr r2, [fp, #-24]
    add r3, r2, r3
    ldr r2, [r3]
    ldr r3, [fp, #-12]
    lsl r3, r3, #2
    ldr r1, [fp, #-24]
    add r3, r1, r3
    str r2, [r3]
    ldr r3, [fp, #-12]
    add r3, r3, #1
    lsl r3, r3, #2
    ldr r2, [fp, #-24]
    add r3, r2, r3
    ldr r2, [fp, #-16]
    str r2, [r3]
.L4:
    ldr r3, [fp, #-12]
    add r3, r3, #1
    str r3, [fp, #-12]
.L3:
    ldr r2, [fp, #-28]
    ldr r3, [fp, #-8]
    sub r2, r2, r3
    sub r2, r2, #1
    ldr r3, [fp, #-12]
    cmp r3, r2
    blt .L5
    ldr r3, [fp, #-8]
    add r3, r3, #1
    str r3, [fp, #-8]
.L2:
    ldr r2, [fp, #-28]
    sub r2, r2, #1
    ldr r3, [fp, #-8]
    cmp r3, r2
    blt .L6
    sub sp, fp, #4
    pop {fp, pc}

.global main
main:
    // ... abbreviated for brevity ...`,
            
            O1: `// ARM Assembly - Array with optimization (-O1)
// ... abbreviated for brevity ...
// Full content would be similar but more optimized`,
            
            O2: `// ARM Assembly - Array with aggressive optimization (-O2)
// ... abbreviated for brevity ...
// Full content would feature loop unrolling and more aggressive optimizations`
        },
        riscv: {
            O0: `# RISC-V Assembly - Array example (-O0)
# ... abbreviated for brevity ...`,
            O1: `# RISC-V Assembly - Array with optimization (-O1)
# ... abbreviated for brevity ...`,
            O2: `# RISC-V Assembly - Array with aggressive optimization (-O2)
# ... abbreviated for brevity ...`
        },
        llvm: {
            O0: `; LLVM IR - Array example (-O0)
define void @bubbleSort(i32* %arr, i32 %n) {
entry:
  %arr.addr = alloca i32*, align 8
  %n.addr = alloca i32, align 4
  %i = alloca i32, align 4
  %j = alloca i32, align 4
  %temp = alloca i32, align 4
  store i32* %arr, i32** %arr.addr, align 8
  store i32 %n, i32* %n.addr, align 4
  store i32 0, i32* %i, align 4
  br label %for.cond

for.cond:
  %0 = load i32, i32* %i, align 4
  %1 = load i32, i32* %n.addr, align 4
  %sub = sub nsw i32 %1, 1
  %cmp = icmp slt i32 %0, %sub
  br i1 %cmp, label %for.body, label %for.end11

for.body:
  store i32 0, i32* %j, align 4
  br label %for.cond1

for.cond1:
  %2 = load i32, i32* %j, align 4
  %3 = load i32, i32* %n.addr, align 4
  %4 = load i32, i32* %i, align 4
  %sub2 = sub nsw i32 %3, %4
  %sub3 = sub nsw i32 %sub2, 1
  %cmp4 = icmp slt i32 %2, %sub3
  br i1 %cmp4, label %for.body5, label %for.end

for.body5:
  %5 = load i32*, i32** %arr.addr, align 8
  %6 = load i32, i32* %j, align 4
  %arrayidx = getelementptr inbounds i32, i32* %5, i32 %6
  %7 = load i32, i32* %arrayidx, align 4
  %8 = load i32*, i32** %arr.addr, align 8
  %9 = load i32, i32* %j, align 4
  %add = add nsw i32 %9, 1
  %arrayidx6 = getelementptr inbounds i32, i32* %8, i32 %add
  %10 = load i32, i32* %arrayidx6, align 4
  %cmp7 = icmp sgt i32 %7, %10
  br i1 %cmp7, label %if.then, label %if.end

if.then:
  %11 = load i32*, i32** %arr.addr, align 8
  %12 = load i32, i32* %j, align 4
  %arrayidx8 = getelementptr inbounds i32, i32* %11, i32 %12
  %13 = load i32, i32* %arrayidx8, align 4
  store i32 %13, i32* %temp, align 4
  %14 = load i32*, i32** %arr.addr, align 8
  %15 = load i32, i32* %j, align 4
  %add9 = add nsw i32 %15, 1
  %arrayidx10 = getelementptr inbounds i32, i32* %14, i32 %add9
  %16 = load i32, i32* %arrayidx10, align 4
  %17 = load i32*, i32** %arr.addr, align 8
  %18 = load i32, i32* %j, align 4
  %arrayidx11 = getelementptr inbounds i32, i32* %17, i32 %18
  store i32 %16, i32* %arrayidx11, align 4
  %19 = load i32, i32* %temp, align 4
  %20 = load i32*, i32** %arr.addr, align 8
  %21 = load i32, i32* %j, align 4
  %add12 = add nsw i32 %21, 1
  %arrayidx13 = getelementptr inbounds i32, i32* %20, i32 %add12
  store i32 %19, i32* %arrayidx13, align 4
  br label %if.end

if.end:
  br label %for.inc

for.inc:
  %22 = load i32, i32* %j, align 4
  %inc = add nsw i32 %22, 1
  store i32 %inc, i32* %j, align 4
  br label %for.cond1

for.end:
  br label %for.inc10

for.inc10:
  %23 = load i32, i32* %i, align 4
  %inc11 = add nsw i32 %23, 1
  store i32 %inc11, i32* %i, align 4
  br label %for.cond

for.end11:
  ret void
}

; ... main function abbreviated for brevity ...`,
            O1: `; LLVM IR - Array with optimization (-O1)
; ... abbreviated for brevity ...`,
            O2: `; LLVM IR - Array with aggressive optimization (-O2)
; ... abbreviated for brevity ...`
        }
    },
    
    example3: {
        name: "Recursive Fibonacci",
        code: `// Recursive Fibonacci sequence
int fibonacci(int n) {
    if (n <= 1) {
        return n;
    }
    return fibonacci(n - 1) + fibonacci(n - 2);
}

int main() {
    int i;
    for (i = 0; i < 10; i = i + 1) {
        putint(fibonacci(i));
        putch(32); // space
    }
    putch(10); // newline
    return 0;
}`,
        arm: {
            O0: `// ARM Assembly - Fibonacci recursive (-O0)
.global fibonacci
fibonacci:
    push {fp, lr}
    add fp, sp, #4
    sub sp, sp, #8
    str r0, [fp, #-8]
    ldr r3, [fp, #-8]
    cmp r3, #1
    bgt .L2
    ldr r3, [fp, #-8]
    b .L3
.L2:
    ldr r3, [fp, #-8]
    sub r3, r3, #1
    mov r0, r3
    bl fibonacci
    mov r3, r0
    mov r4, r3
    ldr r3, [fp, #-8]
    sub r3, r3, #2
    mov r0, r3
    bl fibonacci
    mov r3, r0
    add r3, r4, r3
.L3:
    mov r0, r3
    sub sp, fp, #4
    pop {fp, pc}

.global main
main:
    push {fp, lr}
    add fp, sp, #4
    sub sp, sp, #8
    mov r3, #0
    str r3, [fp, #-8]
    b .L5
.L6:
    ldr r0, [fp, #-8]
    bl fibonacci
    mov r3, r0
    mov r0, r3
    bl putint
    mov r0, #32
    bl putch
    ldr r3, [fp, #-8]
    add r3, r3, #1
    str r3, [fp, #-8]
.L5:
    ldr r3, [fp, #-8]
    cmp r3, #9
    ble .L6
    mov r0, #10
    bl putch
    mov r3, #0
    mov r0, r3
    sub sp, fp, #4
    pop {fp, pc}`,
            O1: `// ARM Assembly - Fibonacci with optimization (-O1)
// ... abbreviated for brevity ...`,
            O2: `// ARM Assembly - Fibonacci with aggressive optimization (-O2)
// ... abbreviated for brevity ...`
        },
        riscv: {
            O0: `# RISC-V Assembly - Fibonacci recursive (-O0)
# ... abbreviated for brevity ...`,
            O1: `# RISC-V Assembly - Fibonacci with optimization (-O1)
# ... abbreviated for brevity ...`,
            O2: `# RISC-V Assembly - Fibonacci with aggressive optimization (-O2)
# ... abbreviated for brevity ...`
        },
        llvm: {
            O0: `; LLVM IR - Fibonacci recursive (-O0)
define i32 @fibonacci(i32 %n) {
entry:
  %n.addr = alloca i32, align 4
  %retval = alloca i32, align 4
  store i32 %n, i32* %n.addr, align 4
  %0 = load i32, i32* %n.addr, align 4
  %cmp = icmp sle i32 %0, 1
  br i1 %cmp, label %if.then, label %if.end

if.then:
  %1 = load i32, i32* %n.addr, align 4
  store i32 %1, i32* %retval, align 4
  br label %return

if.end:
  %2 = load i32, i32* %n.addr, align 4
  %sub = sub nsw i32 %2, 1
  %call = call i32 @fibonacci(i32 %sub)
  %3 = load i32, i32* %n.addr, align 4
  %sub1 = sub nsw i32 %3, 2
  %call2 = call i32 @fibonacci(i32 %sub1)
  %add = add nsw i32 %call, %call2
  store i32 %add, i32* %retval, align 4
  br label %return

return:
  %4 = load i32, i32* %retval, align 4
  ret i32 %4
}

define i32 @main() {
entry:
  %retval = alloca i32, align 4
  %i = alloca i32, align 4
  store i32 0, i32* %retval, align 4
  store i32 0, i32* %i, align 4
  br label %for.cond

for.cond:
  %0 = load i32, i32* %i, align 4
  %cmp = icmp slt i32 %0, 10
  br i1 %cmp, label %for.body, label %for.end

for.body:
  %1 = load i32, i32* %i, align 4
  %call = call i32 @fibonacci(i32 %1)
  call void @putint(i32 %call)
  call void @putch(i32 32)
  %2 = load i32, i32* %i, align 4
  %add = add nsw i32 %2, 1
  store i32 %add, i32* %i, align 4
  br label %for.cond

for.end:
  call void @putch(i32 10)
  ret i32 0
}

declare void @putint(i32)
declare void @putch(i32)`,
            O1: `; LLVM IR - Fibonacci with optimization (-O1)
; ... abbreviated for brevity ...`,
            O2: `; LLVM IR - Fibonacci with aggressive optimization (-O2)
; ... abbreviated for brevity ...`
        }
    },
    
    example4: {
        name: "Matrix Multiplication",
        code: `// Matrix multiplication
void matrixMultiply(int a[2][3], int b[3][2], int result[2][2]) {
    int i, j, k;
    for (i = 0; i < 2; i++) {
        for (j = 0; j < 2; j++) {
            result[i][j] = 0;
            for (k = 0; k < 3; k++) {
                result[i][j] += a[i][k] * b[k][j];
            }
        }
    }
}

int main() {
    int matrix1[2][3] = {{1, 2, 3}, {4, 5, 6}};
    int matrix2[3][2] = {{7, 8}, {9, 10}, {11, 12}};
    int result[2][2];
    int i, j;
    
    matrixMultiply(matrix1, matrix2, result);
    
    for (i = 0; i < 2; i++) {
        for (j = 0; j < 2; j++) {
            putint(result[i][j]);
            putch(32); // space
        }
        putch(10); // newline
    }
    
    return 0;
}`,
        arm: {
            O0: `// ARM Assembly - Matrix Multiplication (-O0)
// ... abbreviated for brevity ...`,
            O1: `// ARM Assembly - Matrix Multiplication with optimization (-O1)
// ... abbreviated for brevity ...`,
            O2: `// ARM Assembly - Matrix Multiplication with aggressive optimization (-O2)
// ... abbreviated for brevity ...`
        },
        riscv: {
            O0: `# RISC-V Assembly - Matrix Multiplication (-O0)
# ... abbreviated for brevity ...`,
            O1: `# RISC-V Assembly - Matrix Multiplication with optimization (-O1)
# ... abbreviated for brevity ...`,
            O2: `# RISC-V Assembly - Matrix Multiplication with aggressive optimization (-O2)
# ... abbreviated for brevity ...`
        },
        llvm: {
            O0: `; LLVM IR - Matrix Multiplication (-O0)
; ... abbreviated for brevity ...`,
            O1: `; LLVM IR - Matrix Multiplication with optimization (-O1)
; ... abbreviated for brevity ...`,
            O2: `; LLVM IR - Matrix Multiplication with aggressive optimization (-O2)
; ... abbreviated for brevity ...`
        }
    }
}; 