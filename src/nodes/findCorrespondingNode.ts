export function findCorrespondingNode(
    nodeInA: Node,
    rootA: Node,
    rootB: Node
): Node | null {
    const pathInA = [];
    let temp = nodeInA;
    while (temp !== rootA) {
        console.log("childNodesA", temp.parentNode!.childNodes);
        console.log("childNodesB", rootB.childNodes);
        console.log("temp", temp);
        pathInA.unshift(
            Array.prototype.indexOf.call(temp.parentNode!.childNodes, temp)
        );
        temp = temp.parentNode!;
    }
    console.log("pathInA", pathInA);
    if (rootB.firstChild && rootB.firstChild!.nodeValue?.trim() === "") {
        rootB.removeChild(rootB.firstChild);
    }
    let correspondingNodeInB = rootB;
    // TODO: refactor for of

    for (const index of pathInA) {
        if (correspondingNodeInB.childNodes[index]) {
            correspondingNodeInB = correspondingNodeInB.childNodes[index];
        } else {
            return null;
        }
    }

    return correspondingNodeInB;
}
