import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TreeNode {
  id: string;
  name: string;
  children?: TreeNode[];
  expanded?: boolean;
  tooltip?: string;
  icon?: string;
  disabled?:boolean;
  showChildCount?:boolean;
  actions?:{add?:boolean,delete?:boolean};
}

@Component({
  selector: 'app-tree-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tree-view.component.html',
  styleUrls: ['./tree-view.component.scss']
})
export class TreeViewComponent {
  @Input() nodes: TreeNode[] = [];
  @Input() highlightNode: TreeNode | null = null;
  @Output() nodeExpanded = new EventEmitter<TreeNode>();
  @Output() nodeCollapsed = new EventEmitter<TreeNode>();
  @Output() nodeClicked = new EventEmitter<TreeNode>();
  @Output() nodeDoubleClicked = new EventEmitter<TreeNode>();
  @Output() nodeAdded = new EventEmitter<{ parent: TreeNode | null, newNode: TreeNode }>();
  @Output() nodeRemoved = new EventEmitter<{ parent: TreeNode | null, removedNode: TreeNode }>();

  onNodeClick(node: TreeNode) {
    if(node.disabled){
      return;
    }
    this.nodeClicked.emit(node);
    if (node.children && node.children.length > 0) {
      this.toggleNode(node);
    }
  }

  onNodeDoubleClick(node: TreeNode, event: MouseEvent) {
    if(node.disabled){
      return;
    }
    event.preventDefault(); // Prevent default double-click behavior
    this.nodeDoubleClicked.emit(node);
  }

  toggleNode(node: TreeNode) {
    if (node.children && node.children.length > 0) {
      node.expanded = !node.expanded;
      if (node.expanded) {
        this.nodeExpanded.emit(node);
      } else {
        this.nodeCollapsed.emit(node);
      }
    }
  }

  isHighlighted(node: TreeNode): boolean {
    return this.highlightNode !== null && node.id === this.highlightNode.id;
  }

  getNodeIcon(node: TreeNode): string {
    if (node.icon) {
      return node.icon;
    }
    if (node.children && node.children.length > 0) {
      return node.expanded ? 'fa-regular fa-folder-open' : 'fa-regular fa-folder';
    }
    return 'fa-regular fa-file';
  }

  onAddClick(node: TreeNode) {
    const newNode: TreeNode = {
      id: `new-${Date.now()}`,
      name: 'New Node',
      children: []
    };
    if (!node.children) {
      node.children = [];
    }
    node.children.push(newNode);
    this.nodeAdded.emit({ parent: node, newNode });
  }

  onRemoveClick(node: TreeNode) {
    const parent = this.findParentNode(this.nodes, node);
    if (parent) {
      parent.children = parent.children?.filter(child => child.id !== node.id);
    } else {
      this.nodes = this.nodes.filter(n => n.id !== node.id);
    }
    this.nodeRemoved.emit({ parent, removedNode: node });
  }

  findParentNode(nodes: TreeNode[], targetNode: TreeNode): TreeNode | null {
    for (const node of nodes) {
      if (node.children && node.children.includes(targetNode)) {
        return node;
      }
      if (node.children) {
        const parent = this.findParentNode(node.children, targetNode);
        if (parent) {
          return parent;
        }
      }
    }
    return null;
  }

  onChildNodeExpanded(node: TreeNode) {
    this.nodeExpanded.emit(node);
  }

  onChildNodeCollapsed(node: TreeNode) {
    this.nodeCollapsed.emit(node);
  }

  onChildNodeClicked(node: TreeNode) {
    this.nodeClicked.emit(node);
  }

  onChildNodeDoubleClicked(node: TreeNode) {
    this.nodeDoubleClicked.emit(node);
  }

  onChildNodeAdded(event: { parent: TreeNode | null, newNode: TreeNode }) {
    this.nodeAdded.emit(event);
  }

  onChildNodeRemoved(event: { parent: TreeNode | null, removedNode: TreeNode }) {
    this.nodeRemoved.emit(event);
  }
}