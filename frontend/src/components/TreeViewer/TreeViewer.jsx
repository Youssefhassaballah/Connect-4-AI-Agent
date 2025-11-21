import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Eye, EyeOff, Download, Minimize2, Maximize2 } from 'lucide-react';

/**
 * TreeNode component - renders a single node in the tree with visual tree structure
 */
const TreeNode = ({ node, depth = 0, index = 0, isLast = false, parentLines = [] }) => {
    const [isOpen, setIsOpen] = useState(depth < 2); // Auto-expand first 2 levels

    if (!node) return null;

    const hasChildren = node.children && node.children.length > 0;

    // Determine node color based on type
    const getNodeColor = () => {
        if (node.type === 'root') return 'bg-purple-100 border-purple-400 text-purple-900';
        if (node.type === 'max') return 'bg-blue-100 border-blue-400 text-blue-900';
        if (node.type === 'min') return 'bg-red-100 border-red-400 text-red-900';
        if (node.type === 'chance') return 'bg-yellow-100 border-yellow-400 text-yellow-900';
        return 'bg-gray-100 border-gray-400 text-gray-900';
    };

    const getValueColor = () => {
        if (node.value > 0) return 'text-green-600';
        if (node.value < 0) return 'text-red-600';
        return 'text-gray-600';
    };

    // Build tree lines
    const renderTreeLines = () => {
        return (
            <div className="flex items-center">
                {/* Parent connection lines */}
                {parentLines.map((showLine, idx) => (
                    <div key={idx} className="w-6 flex justify-center">
                        {showLine && <div className="w-px h-full bg-gray-300"></div>}
                    </div>
                ))}

                {/* Current node connection */}
                {depth > 0 && (
                    <div className="relative w-6 h-full flex items-center">
                        {/* Vertical line */}
                        <div className={`absolute w-px bg-gray-300 ${isLast ? 'h-1/2 top-0' : 'h-full'}`}></div>
                        {/* Horizontal line */}
                        <div className="absolute w-full h-px bg-gray-300 top-1/2"></div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="relative">
            <div className="flex items-start">
                {/* Tree structure lines */}
                {renderTreeLines()}

                {/* Expand/Collapse button */}
                <div className="flex-shrink-0 mr-2">
                    {hasChildren ? (
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-1 hover:bg-gray-200 rounded transition-colors"
                        >
                            {isOpen ? (
                                <ChevronDown className="w-4 h-4 text-gray-600" />
                            ) : (
                                <ChevronRight className="w-4 h-4 text-gray-600" />
                            )}
                        </button>
                    ) : (
                        <div className="w-6"></div>
                    )}
                </div>

                {/* Node content */}
                <div className={`flex-1 mb-3 rounded-lg border-2 ${getNodeColor()} p-3 shadow-sm hover:shadow-md transition-shadow`}>
                    <div className="flex items-center justify-between flex-wrap gap-2">
                        {/* Node info */}
                        <div className="space-y-1">
                            {/* Type badge */}
                            <div className="flex items-center space-x-2">
                                <span className="text-xs font-bold uppercase px-2 py-1 rounded bg-white bg-opacity-50">
                                    {node.type}
                                </span>
                                {node.column !== undefined && (
                                    <span className="text-sm">
                                        <span className="font-semibold">Col:</span> {node.column}
                                    </span>
                                )}
                                {node.pruned && (
                                    <span className="text-xs font-bold px-2 py-1 rounded bg-orange-200 text-orange-800">
                                        PRUNED
                                    </span>
                                )}
                            </div>

                            {/* Value */}
                            {node.value !== undefined && (
                                <div className="text-lg font-bold">
                                    <span className="text-gray-700 text-sm">Value: </span>
                                    <span className={getValueColor()}>{node.value}</span>
                                </div>
                            )}

                            {/* Alpha-Beta values */}
                            {node.alpha !== undefined && node.beta !== undefined && (
                                <div className="text-xs font-mono space-x-3">
                                    <span>α: <strong>{node.alpha === -Infinity ? '-∞' : node.alpha === Infinity ? '∞' : node.alpha}</strong></span>
                                    <span>β: <strong>{node.beta === -Infinity ? '-∞' : node.beta === Infinity ? '∞' : node.beta}</strong></span>
                                </div>
                            )}

                            {/* Probability (for expectiminimax) */}
                            {node.probability !== undefined && (
                                <div className="text-xs">
                                    <span className="font-semibold">Probability: </span>
                                    <span className="font-mono">{(node.probability * 100).toFixed(0)}%</span>
                                </div>
                            )}

                            {/* Depth */}
                            {node.depth !== undefined && (
                                <div className="text-xs text-gray-600">
                                    Depth: {node.depth}
                                </div>
                            )}
                        </div>

                        {/* Children count badge */}
                        {hasChildren && (
                            <div className="text-xs bg-white bg-opacity-70 px-3 py-1 rounded-full font-semibold">
                                {node.children.length} {node.children.length === 1 ? 'child' : 'children'}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Children */}
            {hasChildren && isOpen && (
                <div className="ml-6">
                    {node.children.map((child, idx) => (
                        <TreeNode
                            key={`node-${depth}-${idx}`}
                            node={child}
                            depth={depth + 1}
                            index={idx}
                            isLast={idx === node.children.length - 1}
                            parentLines={[...parentLines, idx < node.children.length - 1]}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

/**
 * TreeViewer component - displays the minimax tree from AI moves
 */
const TreeViewer = ({ treeData }) => {
    const [showTree, setShowTree] = useState(true);
    const [expandAll, setExpandAll] = useState(false);

    const downloadTree = () => {
        if (!treeData) return;

        const dataStr = JSON.stringify(treeData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `minimax-tree-${Date.now()}.json`;
        link.click();
        URL.revokeObjectURL(url);
    };

    // Function to expand/collapse all nodes
    const ExpandableTreeNode = ({ node, depth = 0, index = 0, isLast = false, parentLines = [], forceExpand = false }) => {
        const [isOpen, setIsOpen] = useState(depth < 2);

        // Use effect to handle expand all
        React.useEffect(() => {
            if (forceExpand !== undefined) {
                setIsOpen(forceExpand);
            }
        }, [forceExpand]);

        if (!node) return null;

        const hasChildren = node.children && node.children.length > 0;

        const getNodeColor = () => {
            if (node.type === 'root') return 'bg-purple-100 border-purple-400 text-purple-900';
            if (node.type === 'max') return 'bg-blue-100 border-blue-400 text-blue-900';
            if (node.type === 'min') return 'bg-red-100 border-red-400 text-red-900';
            if (node.type === 'chance') return 'bg-yellow-100 border-yellow-400 text-yellow-900';
            return 'bg-gray-100 border-gray-400 text-gray-900';
        };

        const getValueColor = () => {
            if (node.value > 0) return 'text-green-600';
            if (node.value < 0) return 'text-red-600';
            return 'text-gray-600';
        };

        const renderTreeLines = () => {
            return (
                <div className="flex items-center">
                    {parentLines.map((showLine, idx) => (
                        <div key={idx} className="w-6 flex justify-center">
                            {showLine && <div className="w-px h-full bg-gray-300"></div>}
                        </div>
                    ))}

                    {depth > 0 && (
                        <div className="relative w-6 h-full flex items-center">
                            <div className={`absolute w-px bg-gray-300 ${isLast ? 'h-1/2 top-0' : 'h-full'}`}></div>
                            <div className="absolute w-full h-px bg-gray-300 top-1/2"></div>
                        </div>
                    )}
                </div>
            );
        };

        return (
            <div className="relative">
                <div className="flex items-start">
                    {renderTreeLines()}

                    <div className="flex-shrink-0 mr-2">
                        {hasChildren ? (
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="p-1 hover:bg-gray-200 rounded transition-colors"
                            >
                                {isOpen ? (
                                    <ChevronDown className="w-4 h-4 text-gray-600" />
                                ) : (
                                    <ChevronRight className="w-4 h-4 text-gray-600" />
                                )}
                            </button>
                        ) : (
                            <div className="w-6"></div>
                        )}
                    </div>

                    <div className={`flex-1 mb-3 rounded-lg border-2 ${getNodeColor()} p-3 shadow-sm hover:shadow-md transition-shadow`}>
                        <div className="flex items-center justify-between flex-wrap gap-2">
                            <div className="space-y-1">
                                <div className="flex items-center space-x-2">
                                    <span className="text-xs font-bold uppercase px-2 py-1 rounded bg-white bg-opacity-50">
                                        {node.type}
                                    </span>
                                    {node.column !== undefined && (
                                        <span className="text-sm">
                                            <span className="font-semibold">Col:</span> {node.column}
                                        </span>
                                    )}
                                    {node.pruned && (
                                        <span className="text-xs font-bold px-2 py-1 rounded bg-orange-200 text-orange-800">
                                            PRUNED
                                        </span>
                                    )}
                                </div>

                                {node.value !== undefined && (
                                    <div className="text-lg font-bold">
                                        <span className="text-gray-700 text-sm">Value: </span>
                                        <span className={getValueColor()}>{node.value}</span>
                                    </div>
                                )}

                                {node.alpha !== undefined && node.beta !== undefined && (
                                    <div className="text-xs font-mono space-x-3">
                                        <span>α: <strong>{node.alpha === -Infinity ? '-∞' : node.alpha === Infinity ? '∞' : node.alpha}</strong></span>
                                        <span>β: <strong>{node.beta === -Infinity ? '-∞' : node.beta === Infinity ? '∞' : node.beta}</strong></span>
                                    </div>
                                )}

                                {node.probability !== undefined && (
                                    <div className="text-xs">
                                        <span className="font-semibold">Probability: </span>
                                        <span className="font-mono">{(node.probability * 100).toFixed(0)}%</span>
                                    </div>
                                )}

                                {node.depth !== undefined && (
                                    <div className="text-xs text-gray-600">
                                        Depth: {node.depth}
                                    </div>
                                )}
                            </div>

                            {hasChildren && (
                                <div className="text-xs bg-white bg-opacity-70 px-3 py-1 rounded-full font-semibold">
                                    {node.children.length} {node.children.length === 1 ? 'child' : 'children'}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {hasChildren && isOpen && (
                    <div className="ml-6">
                        {node.children.map((child, idx) => (
                            <ExpandableTreeNode
                                key={`node-${depth}-${idx}`}
                                node={child}
                                depth={depth + 1}
                                index={idx}
                                isLast={idx === node.children.length - 1}
                                parentLines={[...parentLines, idx < node.children.length - 1]}
                                forceExpand={forceExpand}
                            />
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    Minimax Tree Visualization
                </h2>
                <div className="flex space-x-2">
                    <button
                        onClick={() => setExpandAll(!expandAll)}
                        className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 
                     transition-colors flex items-center space-x-2 text-sm"
                    >
                        {expandAll ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                        <span>{expandAll ? 'Collapse All' : 'Expand All'}</span>
                    </button>
                    <button
                        onClick={() => setShowTree(!showTree)}
                        className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 
                     transition-colors flex items-center space-x-2 text-sm"
                    >
                        {showTree ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        <span>{showTree ? 'Hide' : 'Show'}</span>
                    </button>
                    {treeData && (
                        <button
                            onClick={downloadTree}
                            className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 
                       transition-colors flex items-center space-x-2 text-sm"
                        >
                            <Download className="w-4 h-4" />
                            <span>Download JSON</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Legend */}
            {showTree && treeData && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="text-xs font-semibold text-gray-700 mb-2">Legend:</div>
                    <div className="flex flex-wrap gap-3 text-xs">
                        <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 bg-purple-100 border-2 border-purple-400 rounded"></div>
                            <span>Root</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 bg-blue-100 border-2 border-blue-400 rounded"></div>
                            <span>Max (AI)</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 bg-red-100 border-2 border-red-400 rounded"></div>
                            <span>Min (Human)</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 bg-yellow-100 border-2 border-yellow-400 rounded"></div>
                            <span>Chance</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 bg-gray-100 border-2 border-gray-400 rounded"></div>
                            <span>Leaf</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Tree Content */}
            {showTree && (
                <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50 max-h-[700px] overflow-auto">
                    {treeData ? (
                        <div className="font-sans text-sm">
                            <ExpandableTreeNode node={treeData} depth={0} index={0} forceExpand={expandAll} />
                        </div>
                    ) : (
                        <div className="text-center py-12 text-gray-500">
                            <div className="text-4xl mb-4">🌳</div>
                            <p className="text-sm">No tree data available yet</p>
                            <p className="text-xs mt-2">The tree will appear after the AI makes its first move</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default TreeViewer;