onmessage = function (event) {
    const { data } = event

    if (data.type === 'bubbleSort') {
        doSort('bubbleSort', bubbleSort, data.length, data.iterations)
    } else if (data.type === 'mergeSort') {
        doSort('mergeSort', mergeSort, data.length, data.iterations)
    }
}

function doSort (name, sortFunc, length, iterations) {
    let arr = getRandomArray(length)
    const sortRandom = sortWithMeasure(
        sortFunc,
        arr,
        name + 'Random',
        iterations,
        getPostProgressFunc(4, 0, iterations)
    )

    arr = getReverseArray(length)
    const sortReverse = sortWithMeasure(
        sortFunc,
        arr,
        name + 'Reverse',
        iterations,
        getPostProgressFunc(4, 1, iterations)
    )

    arr = getAscendingFirstMaxArray(length)
    const sortAscendingFirstMax = sortWithMeasure(
        sortFunc,
        arr,
        name + 'AscendingFirstMax',
        iterations,
        getPostProgressFunc(4, 2, iterations)
    )

    arr = getAscendingLastMinArray(length)
    const sortAscendingLastMin = sortWithMeasure(
        sortFunc,
        arr,
        name + 'AscendingLastMin',
        iterations,
        getPostProgressFunc(4, 3, iterations)
    )

    performance.clearMeasures(name)

    postMessage({
        type: name + 'Complete',
        [name + 'Random']: sortRandom,
        [name + 'Reverse']: sortReverse,
        [name + 'AscendingFirstMax']: sortAscendingFirstMax,
        [name + 'AscendingLastMin']: sortAscendingLastMin
    })
}

function getPostProgressFunc (sortingTypesNumber, currentSortCount, iterationsCount) {
    const sortValue = 1 / sortingTypesNumber
    return i => postMessage({
        type: 'progress',
        value: sortValue * currentSortCount + sortValue / iterationsCount * (i + 1)
    })
}

function sortWithMeasure(sortAlgorithm, arr, name, times, iterationCb) {
    for (let i = 0; i < times; i++) {
        const arrCopy = arr.slice()

        performance.mark(name + 'Start')
        bubbleSort(arrCopy)
        performance.mark(name + 'End')

        performance.measure(name, name + 'Start', name + 'End')

        iterationCb?.(i)
    }
    return performance.getEntriesByName(name).map(measure => measure.duration)
}

function getRandomArray (length) {
    return fillArray(length, () => Math.trunc(Math.random() * length))
}

function getReverseArray (length) {
    return fillArray(length, i => length - i - 1)
}

function getAscendingFirstMaxArray (length) {
    const arr = fillArray(length, i => i - 1)
    arr[0] = length - 1
    return arr
}

function getAscendingLastMinArray (length) {
    const arr = fillArray(length, i => i + 1)
    arr[length - 1] = 0
    return arr
}

function fillArray (length, getElement) {
    const arr = new Array(length)
    for (let i = 0; i < length; i++) {
        arr[i] = getElement(i)
    }
    return arr
}

function bubbleSort(arr) {
    for (let i = 0; i < arr.length - 1; i++) {
        let swapped = false
        for (let j = 0; j < arr.length - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                const temp = arr[j]
                arr[j] = arr[j + 1]
                arr[j + 1] = temp

                swapped = true
            }
        }
        if (!swapped) {
            break
        }
    }
}

function merge(arr, leftIndex, middleIndex, rightIndex) {
    const length = rightIndex - leftIndex + 1 // 5
    const merged = new Array(length)

    let leftCursor = leftIndex // 4
    let rightCursor = middleIndex + 1 // 4
    for (let i = 0; i < length; i++) {

        if (rightCursor > rightIndex) {
            merged[i] = arr[leftCursor++]
            continue
        }
        if (leftCursor > middleIndex) {
            merged[i] = arr[rightCursor++]
            continue
        }

        if (arr[rightCursor] < arr[leftCursor]) {
            merged[i] = arr[rightCursor++]
        } else {
            merged[i] = arr[leftCursor++]
        }
    }

    const len = merged.length
    for (let i = 0; i < len; i++) {
        arr[leftIndex + i] = merged[i]
    }
}

function mergeSortImpl (arr, left, right) {
    if (left >= right) {
        return
    }
    const medium = left + Math.trunc((right - left) / 2)
    mergeSortImpl(arr, left, medium)
    mergeSortImpl(arr, medium + 1, right)
    merge(arr, left, medium, right)
}

function mergeSort (arr){
    mergeSortImpl(arr, 0, arr.length - 1)
}
