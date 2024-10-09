import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TreeViewComponent, TreeNode } from '../tree-view/tree-view.component';

@Component({
  selector: 'app-demo-page',
  standalone: true,
  imports: [CommonModule, FormsModule, TreeViewComponent],
  templateUrl: './demo-page.component.html',
  styleUrls: ['./demo-page.component.scss']
})
export class DemoPageComponent implements OnInit {
  treeData: TreeNode[] = [];
  backupTreeData: TreeNode[] = [];
  highlightNode: TreeNode | null = null;
  eventLog: string[] = [];
  newNodeName: string = '';
  selectedNode: TreeNode | null = null;

  ngOnInit() {
    this.initializeTreeData();
  }

  initializeTreeData() {
    this.treeData = [
      {
        id: '1',
        name: 'Root',
        icon: {collapsed:'fa-solid fa-chevron-right',expanded:'fa-solid fa-chevron-down'},
        expanded: true,
        actions:{add:true,delete:true},
        showChildCount:true,
        children: [
          {
            id: '2',
            name: 'Child 1',
            expanded: true,
            actions:{add:true,delete:true},
            showChildCount:true,
            children: [
              { id: '5', name: 'Grandchild 1' },
              { id: '6', name: 'Grandchild 2' }
            ]
          },
          {
            id: '3',
            name: 'Child 2',
            actions:{add:false,delete:true},
            children: [
              { id: '7', name: 'Grandchild 3' },
              { id: '8', name: 'Grandchild 4', icon: 'fa-regular fa-file-pdf' }
            ]
          },
          { 
            id: '4', 
            name: 'Child 3', 
            tooltip: 'This is Child 3',
            disabled: true
          }
        ]
      }
    ];
    this.backupTreeData = JSON.parse(JSON.stringify(this.treeData));
  }

  onNodeExpanded(node: TreeNode) {
    this.logEvent(`Node expanded: ${node.name}`);
  }

  onNodeCollapsed(node: TreeNode) {
    this.logEvent(`Node collapsed: ${node.name}`);
  }

  onNodeClicked(node: TreeNode) {
    this.logEvent(`Node clicked: ${node.name}`);
    this.selectedNode = node;
    if(!node.children){
      this.highlightNode = node;
    }
  }

  onNodeDoubleClicked(node: TreeNode) {
    this.logEvent(`Node double-clicked: ${node.name}`);
  }

  addNode() {
    if (this.selectedNode && this.newNodeName) {
      if (!this.selectedNode.children) {
        this.selectedNode.children = [];
      }
      const newNode: TreeNode = {
        id: `new-${Date.now()}`,
        name: this.newNodeName
      };
      this.selectedNode.children.push(newNode);
      this.selectedNode.expanded = true;
      this.selectedNode.icon = undefined;
      this.newNodeName = '';
      this.logEvent(`New node added: ${newNode.name}`);
    }else{
      this.logEvent(`Select a node and then try to add a child to it.`);
    }
  }

  resetTree() {
    this.treeData = JSON.parse(JSON.stringify(this.backupTreeData));
    this.logEvent('Tree reset to initial state');
  }

  logEvent(event: string) {
    this.eventLog.unshift(event);
    if (this.eventLog.length > 5) {
      this.eventLog.pop();
    }
  }
}