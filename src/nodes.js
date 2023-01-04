

class PlusNode {
    value

    constructor(num) {
        this.value = num
    }

    repr = () => {
        return value
    }
}

class MinusNode {
    value

    constructor(num) {
        this.value = num
    }

    repr = () => {
        return value
    }
}

class AddNode {
    nodeA
    nodeB

    constructor(crA, crB) {
        this.nodeA = crA
        this.nodeB = crB
    }

    repr = () => {
        return `${nodeA} + ${nodeB}`
    }
}

class SubtractNode {
    nodeA
    nodeB

    constructor(crA, crB) {
        this.nodeA = crA
        this.nodeB = crB
    }

    repr = () => {
        return `${nodeA} - ${nodeB}`
    }
}

class MultiplyNode {
    nodeA
    nodeB

    constructor(crA, crB) {
        this.nodeA = crA
        this.nodeB = crB
    }

    repr = () => {
        return `${nodeA} * ${nodeB}`
    }
}

class DivideNode {
    nodeA
    nodeB

    constructor(crA, crB) {
        this.nodeA = crA
        this.nodeB = crB
    }

    repr = () => {
        return `${nodeA} / ${nodeB}`
    }
}

class VarAssignNode {
    nodeA
    nodeB
    
    constructor(crA, crB) {
        this.nodeA = crA
        this.nodeB = crB
    }

    repr = () => {
        return `var ${nodeA} = ${nodeB}`
    }
}

class IdentifierNode {
    identity

    constructor(val) {
        this.identity = val
    }

    repr = () => {
        return `${identity}`
    }
}

class ReferenceNode {
    varName

    constructor(ref) {
        this.varName = ref
    }

    repr = () => {
        return `Ref: ${varName}`
    }
}

class StringNode {
    value
    constructor(val) {
        this.value = val
    }

    repr = () => this.value
}

class ReturnNode {
    value
    constructor(value) {
        this.value = value
    }
}

class FuncCreateNode {
    returnNode = []
    statementNode
    argumentNode = []
    identifierNode

    constructor(returnNode, statementNode, argumentNode, identifierNode) {
        this.returnNode = returnNode
        this.statementNode = statementNode
        this.argumentNode = argumentNode
        this.identifierNode = identifierNode
    }

    repr = () => {
        return `Function body: ${this.statementNodes} Returns: ${this.returnNode}`
    }
}

class FuncCallNode {
    ident
    args

    constructor(identifier, argument) {
        this.ident = identifier
        this.args = argument
    }

    repr = () => `ident: ${ident} args: ${args}`
}

class StatementSequence {
    nodes = []

    add(node) {
        this.nodes.push(node)
    }

    constructor(argNodes) {
        if(argNodes) this.nodes = argNodes
    }

    repr = () => {
        return JSON.stringify(this.nodes, null, 4) 
    }
}

class LogNode {
    node   
    constructor(node) {
        this.node = node
    }
}

class InputNode {
    outputNode
    questionNode
    constructor(output, question) {
        this.outputNode = output
        this.questionNode = question
    }
}

class MutateNode {
    ident
    value
    constructor(ident, value) {
        this.ident = ident
        this.value = value
    }
}

class ModuloNode {
    nodeA
    nodeB

    constructor(dividendNode, divisorNode) {
        this.nodeA = dividendNode
        this.nodeB = divisorNode
    }
}

class LoopNode {
    statementNode
    conditionNode

    constructor(condition, statements) {
        this.conditionNode = condition
        this.statementNode = statements

    }
}

class BooleanNode {
    bool

    constructor(bool) {
        this.bool = bool
    }
}

class ConditionNode {
    condition
    statementNode
    elseNode

    constructor(condition, statements, elseStatement) {
        this.condition = condition
        this.statementNode = statements
        this.elseNode = elseStatement
    }
}

class CompareNode {
    nodeA
    nodeB
    constructor(nodeA, nodeB) {
        this.nodeA = nodeA
        this.nodeB = nodeB
    }
}

class AndNode {
    nodeA
    nodeB
    constructor(nodeA, nodeB) {
        this.nodeA = nodeA
        this.nodeB = nodeB
    }
}

module.exports = {
    PlusNode, 
    MinusNode, 
    AddNode, 
    SubtractNode, 
    MultiplyNode, 
    DivideNode, 
    VarAssignNode, 
    IdentifierNode, 
    ReferenceNode,
    StringNode,
    FuncCreateNode,
    StatementSequence,
    FuncCallNode,
    LogNode,
    InputNode,
    MutateNode,
    ModuloNode,
    LoopNode,
    BooleanNode,
    ConditionNode,
    CompareNode,
    AndNode,
    ReturnNode
}