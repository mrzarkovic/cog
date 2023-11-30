export function findCorrespondingNode(
    nodeInA: Node,
    rootA: Node,
    rootB: Node
): Node | null {
    const pathInA = [];
    let temp = nodeInA;
    while (temp !== rootA) {
        pathInA.unshift(
            Array.prototype.indexOf.call(temp.parentNode!.childNodes, temp)
        );
        temp = temp.parentNode!;
    }

    let correspondingNodeInB = rootB;
    for (const index of pathInA) {
        if (correspondingNodeInB.childNodes[index]) {
            correspondingNodeInB = correspondingNodeInB.childNodes[index];
        } else {
            return null;
        }
    }

    return correspondingNodeInB;
}
