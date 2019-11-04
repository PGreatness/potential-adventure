class Queue {
    constructor() {
        this.items = []
    }

    enqueue(elem) {
        this.items.push(elem)
    }

    dequeue() {
        if (this.isEmpty()) {
            return -1
        }
        return this.items.shift()
    }

    peek() {
        if (this.isEmpty()) {
            return -1
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
}

module.exports = {
    Queue
}