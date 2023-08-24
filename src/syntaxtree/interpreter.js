
const { SubtractNode, MultiplyNode, DivideNode, MinusNode, StringNode, VarAssignNode, ReferenceNode, MutateNode, ArrayNode } = require("../nodes")
const { SymbolTable, Variable, _Function } = require("../variable")
const rls = require("readline-sync")
const { COMPARISON_TYPE } = require("./lexer")

class Interpreter {

    interpret(node) {
        return this.open(node, new SymbolTable())
    }

    raiseError(error) {
        console.log(error)
        process.exit(1)
    }

    open(node, localTable) {

        let result
        
        try {

            switch(node.constructor.name) {
                case 'StatementSequence':
                    result = this.openStatementSequence(node, localTable)
                    break
                case 'AddNode':
                    result = this.openAddNode(node, localTable)
                    break
                case 'SubtractNode':
                    result = this.openSubtractNode(node, localTable)
                    break
                case 'MultiplyNode':
                    result = this.openMultiplyNode(node, localTable)
                    break
                case 'DivideNode':
                    result = this.openDivideNode(node, localTable)
                    break
                case 'ModuloNode':
                    result = this.openModuloNode(node, localTable)
                    break
                case 'PlusNode':
                    result = this.openPlusNode(node, localTable)
                    break
                case 'MinusNode':
                    result = this.openMinusNode(node, localTable)
                    break
                case 'VarAssignNode':
                    result = this.createVariable(node, localTable)
                    break
                case 'ReferenceNode':
                    result = this.openReferenceNode(node, localTable)
                    break
                case 'StringNode':
                    result = this.openStringNode(node)
                    break
                case 'FuncCreateNode':
                    result = this.createFunction(node, localTable)
                    break
                case 'FuncCallNode':
                    result = this.callFunction(node, localTable)
                    break
                case 'LogNode':
                    result = this.printValue(node, localTable)
                    break
                case 'InputNode':
                    result = this.getInput(node, localTable)
                    break
                case 'MutateNode':
                    result = this.mutateVariable(node, localTable)
                    break
                case 'LoopNode':
                    result =  this.loop(node, localTable)
                    break
                case 'BooleanNode':
                    result = this.openBooleanNode(node)
                    break
                case 'ConditionNode':
                    result = this.checkCondition(node, localTable)
                    break
                case 'CompareNode':
                    result = this.compareValues(node, localTable)
                    break
                case 'AndNode':
                    result = this.andValues(node, localTable)
                    break
                case 'ReturnNode':
                    result = this.open(node.value, localTable)
                    break
                case 'ArrayNode':
                    result = this.convertArray(node, localTable)
                    break
                case 'ArrayReferenceNode':
                    result = this.getFromArray(node, localTable)
                    break
                case 'MutateArrayNode':
                    result = this.mutateArray(node, localTable)
                    break
                case 'SizeComparisonNode':
                    result = this.compareSizes(node, localTable)
                    break
                default:
                    console.log('\x1b[31m', `CRITICAL NODE ERROR: [${node.constructor.name} cannot be interpreted], '\x1b[37m'`)
            }
    
        } catch(err) {
            console.error('\x1b[31m', 'CRITICAL NODE ERROR: [Syntax tree could not be built]', '\x1b[37m')
            console.log(node, "<-- thats the node man thats not working")
            result = null
            console.log(err)
        }

        return result

    }

    openBooleanNode = (node) => node.bool

    openStatementSequence(node, localTable) {
        // node.nodes.forEach(element => {
        //     this.open(element, localTable)
        // });

        for(let element of node.nodes) {

            if(element.constructor.name == 'ReturnNode') {
                return this.open(element, localTable)
            }

            this.open(element, localTable)
        }
        return false
    }

    openAddNode(node, localTable) {
        return this.open(node.nodeA, localTable) + this.open(node.nodeB, localTable)
    }

    openSubtractNode(node, localTable) {
        return this.open(node.nodeA, localTable) - this.open(node.nodeB, localTable)
    }

    openMultiplyNode(node, localTable) {
        return this.open(node.nodeA, localTable) * this.open(node.nodeB, localTable)
    }

    openDivideNode(node, localTable) {
        return this.open(node.nodeA, localTable) / this.open(node.nodeB, localTable)
    }

    openModuloNode(node, localTable) {
        return this.open(node.nodeA, localTable) % this.open(node.nodeB, localTable)
    }

    openPlusNode(node) {
        return node.value
    }

    openMinusNode(node) {
        return -node.value
    }

    compareValues(node, localTable) {
        
        const value1 = this.open(node.nodeA, localTable)
        const value2 = this.open(node.nodeB, localTable)
        
        switch(node.operator) {
            case COMPARISON_TYPE.AND:
                return value1 && value2
            case COMPARISON_TYPE.EQ:
                return value1 == value2
            case COMPARISON_TYPE.EQNOT:
                return value1 != value2
            case COMPARISON_TYPE.GREATER:
                return value1 > value2
            case COMPARISON_TYPE.LESS:
                return value1 < value2
            case COMPARISON_TYPE.GREATEREQ:
                return value1 >= value2
            case COMPARISON_TYPE.LESSEQ:
                return value1 <= value2
        }
    }

    compareSizes(node, localTable) {
        if(node.operator == "<") return this.open(node.nodeA, localTable) < this.open(node.nodeB, localTable)
        else return this.open(node.nodeA, localTable) > this.open(node.nodeB, localTable)
    }

    andValues(node, localTable) {
        return this.open(node.nodeA, localTable) && this.open(node.nodeB, localTable)
    }

    structuredClone = val => {
        return JSON.parse(JSON.stringify(val))
    }
    
    openReferenceNode(node, localTable) {
        // console.log("ident: " + node.varName)
        return this.structuredClone(this.searchSymbol(node.varName, localTable))
    }


    createVariable(node, localTable) {
        let value
        if(node.nodeB) {
            value = this.structuredClone(this.open(node.nodeB, localTable))
        } 

        localTable.add(new Variable('any', node.nodeA, value))
    }

    convertArray(node, localTable) {
        const array = []

        for(let value of node.array) {
            array.push(this.open(value, localTable))
        }

        return array
    }

    getFromArray(node, localTable) {
        const array = this.searchSymbol(node.ident, localTable)

        return array[this.open(node.index, localTable)]
    }

    createFunction(node, localTable) {

        let returns = node.returnNode

        if(node.returnNode != null && node.returnNode.constructor.name == "VarAssignNode") {
            node.statementNode.nodes.unshift(node.returnNode)
            returns = new ReferenceNode(returns.nodeA)
        }



        let result
        result = new _Function(returns, node.identifierNode, node.statementNode, node.argumentNode)
        // console.log("RETURN -> " + node.returnNode)
        localTable.add(result)
        return result
    }

    callFunction(node, localTable) {
        // console.log("!!!!  " + JSON.stringify(SymbolTable.get(node.ident)))
        // console.log("!!!  " + SymbolTable.get(node.ident))
        const func = localTable.get(node.ident)
        
        if(!func) {
            console.log(`${node.ident} does not exist`)
        }

        for(let i = 0; i < node.args.length; i++) {
            func.body.nodes.unshift(new VarAssignNode(func.arguments[i], node.args[i]))
        }

        const table = new SymbolTable()

        table.setParent(localTable)

        let result = this.open(func.body, table)

        if(result) {
            return result
        }
        if(func.returns) return this.open(func.returns, table)
    }

    loop(node, localTable) {

        const condition = this.open(node.conditionNode, localTable)

        switch(typeof condition) {
            case "boolean":
                while(this.open(node.conditionNode, localTable)) {
                    this.open(node.statementNode, new SymbolTable(localTable))
                }
                break
            case "number":
                for(let i = this.open(node.conditionNode, localTable); i > 0; i--) {
                    this.open(node.statementNode, new SymbolTable(localTable))
                }
                break
        }

    }

    openStringNode = (node) => node.value  

    mutateArray(node, localTable) {

        const ident = node.arrayReference.ident
        const newValue = this.open(node.value, localTable)
        const index = this.open(node.arrayReference.index, localTable)

        let updatedArray = this.searchSymbol(ident, localTable)
        updatedArray[index] = newValue
            
        return this.mutateVariable(new MutateNode(ident, updatedArray, true), localTable, true)
    }

    mutateVariable(node, localTable, isConverted=false) {

        const value = isConverted ? node.value : this.open(node.value, localTable) 

        while(!localTable.mutate(node.ident, value)) {
            localTable = localTable.parent
            if(!localTable) {
                console.log(`${node.ident} cannot be changed cuz undefined`)
                return
            }
        }
        return true
    }

    printValue(node, localTable) {
        console.log(this.open(node.node, localTable))
    }

    getInput(node, localTable) {
        const input = rls.question(node.questionNode)
        // const input = "here have me some absolutely beautiful input mate"

        this.mutateVariable({"ident": node.outputNode.varName, "value": new StringNode(input)}, localTable)
        return true
    }

    checkCondition(node, localTable) {
        if(this.open(node.condition, localTable)) {
            this.open(node.statementNode, new SymbolTable(localTable))
        } else if(node.elseNode) {
            this.open(node.elseNode, new SymbolTable(localTable))
        }
    }

    searchSymbol(_name, table) {
        let result
        // SymbolTable.table.forEach(variable => {
        //     if(_name == variable.identifier) {
        //         // console.log("found  " + variable.value)
        //         result = variable.value
        //     }

        //     // console.log(variable.identifier + "HWHJAKLHJKLHDJKLASHDJKLAHDSKLA")
        // })

        while(table) {
            table.table.forEach(variable => {
                if(_name == variable.identifier) {
                    result = variable.value
                }
            })
            table = table.parent
        }

        if (result != null) return result

        // console.log("found nothing man  " + JSON.stringify(SymbolTable.table, null, 4))
        console.log(_name + " is undefined")
        process.exit(1)
    }
}


module.exports = Interpreter