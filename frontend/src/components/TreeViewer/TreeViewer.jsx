import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Eye, EyeOff, Download } from 'lucide-react';

/**
 * TreeNode component - renders a single node in the tree
 */
const TreeNode = ({ node, depth = 0, index = 0 }) => {
    const [isOpen, setIsOpen] = useState(depth < 2); // Auto-expand first 2 levels

    if (!node) return null;

    const hasChildren = node.children && node.children.length > 0;
    const indentStyle = { marginLeft: `${Math.min(depth * 16, 48)}px` };

    return (
        <div className="mb-2">
            <div className="flex items-start space-x-2" style={indentStyle}>
                {/* Expand/Collapse button */}
                {hasChildren && (
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="mt-1 text-gray-600 hover:text-gray-800 transition-colors flex-shrink-0"
                    >
                        {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>
                )}

                {/* Node content */}
                <div className="flex-1 bg-white rounded-lg p-3 shadow-sm border border-gray-200 hover:border-indigo-300 transition-colors">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            {node.column !== undefined && (
                                <div className="text-xs text-gray-600">
                                    <span className="font-semibold">Column:</span> {node.column}
                                </div>
                            )}
                            {node.value !== undefined && (
                                <div className="text-sm">
                                    <span className="font-semibold text-gray-700">Value:</span>{' '}
                                    <span className={`font-bold ${node.value > 0 ? 'text-green-600' : node.value < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                                        {node.value}
                                    </span>
                                </div>
                            )}
                            {node.type && (
                                <div className="text-xs text-gray-500">
                                    <span className="font-semibold">Type:</span> {node.type}
                                </div>
                            )}
                            {node.alpha !== undefined && node.beta !== undefined && (
                                <div className="text-xs text-gray-500">
                                    α: {node.alpha}, β: {node.beta}
                                </div>
                            )}
                        </div>

                        {hasChildren && (
                            <div className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
                                {node.children.length} children
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Children */}
            {hasChildren && isOpen && (
                <div className="mt-2">
                    {node.children.map((child, idx) => (
                        <TreeNode key={`node-${depth}-${idx}`} node={child} depth={depth + 1} index={idx} />
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

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    Minimax Tree
                </h2>
                <div className="flex space-x-2">
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
                            <span>Download</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Tree Content */}
            {showTree && (
                <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50 max-h-[600px] overflow-y-auto">
                    {treeData ? (
                        <div className="space-y-2">
                            {/* Tree Visualization */}
                            <div className="font-mono text-sm">
                                <TreeNode node={treeData} depth={0} index={0} />
                            </div>

                            {/* Raw JSON View (Optional) */}
                            <details className="mt-6">
                                <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800 font-semibold">
                                    View Raw JSON
                                </summary>
                                <pre className="mt-2 bg-gray-800 text-green-400 p-4 rounded-lg overflow-x-auto text-xs">
                                    {JSON.stringify(treeData, null, 2)}
                                </pre>
                            </details>
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