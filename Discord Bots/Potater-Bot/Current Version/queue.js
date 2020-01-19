class Queue {
    constructor(arr=[]) {
        this.items = arr
    }

    enqueue(elem) {
        this.items.push(elem)
    }

    dequeue() {
        if (this.isEmpty()) {
            return null
        }
        return this.items.shift()
    }

    peek() {
        if (this.isEmpty()) {
            return null
        }
        return this.items[0]
    }

    isEmpty() {
        return this.items.length == 0
    }

    print() {
        var retStr = ""
        for (i = 0; i < this.items.length; i++) {
            retStr += `| ${this.items[i]} |`
        }
        return retStr
    }

    findPlace(elem) {
        for (i =0; i < this.items.length; i++) {
            if (this.items[i] == elem) {
                return i
            }
        }
        return -1
    }

    size() {
        return this.items.length
    }

    copy() {
        var ret = new Queue()
        for (i = 0; i < this.items.length; i++) {
            ret.enqueue(this.items[i])
        }
        return ret
    }

    uniqueCopy() {
        var tmp = []
        for (i = 0; i < this.items.length; i++) {
            if (!tmp.includes(this.items[i])) {
                tmp.push(this.items[i])
            }
        }
        return tmp
    }

    clear() {
        this.items = []
    }
}

module.exports = {
    Queue
}