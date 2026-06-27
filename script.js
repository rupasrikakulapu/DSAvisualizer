// ── GLOBAL STATE ──────────────────────────────────────────────
let currentViz  = 'array';
let isDark      = true;
let animSpeed   = 1000;
let isPlaying   = false;
let highlightIdx = -1;

// ── LINEAR STORES ──────────────────────────────────────────────
let arrayData         = [10, 20, 30, 40, 50];
let linkedData        = [10, 20, 30, 40];
let doublyData        = [10, 20, 30, 40];
let circularData      = [10, 20, 30];
let stackData         = [10, 20, 30, 40];
let simpleQueueData   = [10, 20, 30, 40];
let circularQueueData = [10, 20, 30, 40, 50, 60];
const CQ_CAP          = 8;
let priorityQueueData = [{ v: 20, p: 1 }, { v: 10, p: 2 }, { v: 30, p: 3 }];
let dequeData         = [10, 20, 30, 40];

// ── NON-LINEAR STORES ──────────────────────────────────────────
let treeData    = [];
let heapData    = [];
let heapType    = 'min';

let graphNodes    = [];
let graphEdges    = [];
let graphDirected = false;
let graphWeighted = false;

let trieRoot  = { c: '', children: {}, end: false };
let trieWords = [];
// ── VISUALIZER CONFIGS ────────────────────────────────────────
// Each key matches a `currentViz` string.
// ops:       [[label, handlerKey, btnClass], ...]
// traversal: [[label, handlerKey], ...]        (empty = none)
// complexity:[[operation, best, avg, worst], ...]
// code:      HTML string (syntax-highlighted)
// ─────────────────────────────────────────────────────────────

const configs = {

  /* ── ARRAY ── */
  array: {
    icon: '📦', title: 'Array', page: 'linear',
    desc: 'Contiguous memory with O(1) index access',
    ops: [
      ['Insert', 'insert', 'success'],
      ['Delete (last)', 'deleteOp', 'danger'],
      ['Search', 'search', ''],
      ['Update (last)', 'update', ''],
    ],
    traversal: [],
    complexity: [
      ['Access',  'O(1)', 'O(1)', 'O(1)'],
      ['Search',  'O(n)', 'O(n)', 'O(n)'],
      ['Insert',  'O(n)', 'O(n)', 'O(n)'],
      ['Delete',  'O(n)', 'O(n)', 'O(n)'],
    ],
    code: `<span class="cm"># Python Array (List)</span>
<span class="kw">class</span> <span class="fn">Array</span>:
    <span class="kw">def</span> <span class="fn">__init__</span>(self):
        self.data = []

    <span class="kw">def</span> <span class="fn">insert</span>(self, val, idx=-<span class="nm">1</span>):
        <span class="kw">if</span> idx == -<span class="nm">1</span>:
            self.data.append(val)       <span class="cm"># O(1)</span>
        <span class="kw">else</span>:
            self.data.insert(idx, val)  <span class="cm"># O(n)</span>

    <span class="kw">def</span> <span class="fn">delete</span>(self, idx):
        <span class="kw">del</span> self.data[idx]  <span class="cm"># O(n) shift</span>

    <span class="kw">def</span> <span class="fn">search</span>(self, val):
        <span class="kw">for</span> i, x <span class="kw">in</span> <span class="fn">enumerate</span>(self.data):
            <span class="kw">if</span> x == val: <span class="kw">return</span> i
        <span class="kw">return</span> -<span class="nm">1</span>`,
  },

  /* ── SINGLY LINKED LIST ── */
  singly: {
    icon: '🔗', title: 'Singly Linked List', page: 'linear',
    desc: 'Nodes connected by next pointers in one direction',
    ops: [
      ['Insert Head', 'insertHead', 'success'],
      ['Insert Tail', 'insertTail', 'success'],
      ['Delete Head', 'deleteHead', 'danger'],
      ['Search',      'search', ''],
    ],
    traversal: [],
    complexity: [
      ['Access',       'O(n)', 'O(n)', 'O(n)'],
      ['Search',       'O(n)', 'O(n)', 'O(n)'],
      ['Insert head',  'O(1)', 'O(1)', 'O(1)'],
      ['Delete head',  'O(1)', 'O(1)', 'O(1)'],
    ],
    code: `<span class="kw">class</span> <span class="fn">Node</span>:
    <span class="kw">def</span> <span class="fn">__init__</span>(self, val):
        self.val  = val
        self.next = <span class="kw">None</span>

<span class="kw">class</span> <span class="fn">SinglyLinkedList</span>:
    <span class="kw">def</span> <span class="fn">__init__</span>(self):
        self.head = <span class="kw">None</span>

    <span class="kw">def</span> <span class="fn">insert_head</span>(self, val):
        node      = Node(val)
        node.next = self.head
        self.head = node  <span class="cm"># O(1)</span>

    <span class="kw">def</span> <span class="fn">delete_head</span>(self):
        <span class="kw">if</span> self.head:
            self.head = self.head.next  <span class="cm"># O(1)</span>`,
  },

  /* ── DOUBLY LINKED LIST ── */
  doubly: {
    icon: '🔄', title: 'Doubly Linked List', page: 'linear',
    desc: 'Nodes have both prev and next pointers',
    ops: [
      ['Insert Head', 'insertHead', 'success'],
      ['Insert Tail', 'insertTail', 'success'],
      ['Delete Head', 'deleteHead', 'danger'],
      ['Delete Tail', 'deleteTail', 'danger'],
    ],
    traversal: [],
    complexity: [
      ['Access',            'O(n)', 'O(n)', 'O(n)'],
      ['Insert head/tail',  'O(1)', 'O(1)', 'O(1)'],
      ['Delete head/tail',  'O(1)', 'O(1)', 'O(1)'],
      ['Search',            'O(n)', 'O(n)', 'O(n)'],
    ],
    code: `<span class="kw">class</span> <span class="fn">DNode</span>:
    <span class="kw">def</span> <span class="fn">__init__</span>(self, val):
        self.val  = val
        self.prev = <span class="kw">None</span>
        self.next = <span class="kw">None</span>

<span class="kw">class</span> <span class="fn">DoublyLinkedList</span>:
    <span class="kw">def</span> <span class="fn">__init__</span>(self):
        self.head = <span class="kw">None</span>
        self.tail = <span class="kw">None</span>

    <span class="kw">def</span> <span class="fn">insert_head</span>(self, val):
        node = DNode(val)
        <span class="kw">if</span> self.head:
            node.next      = self.head
            self.head.prev = node
        self.head = node`,
  },

  /* ── CIRCULAR LINKED LIST ── */
  circular: {
    icon: '⭕', title: 'Circular Linked List', page: 'linear',
    desc: 'Last node points back to the head',
    ops: [
      ['Insert',   'insert',   'success'],
      ['Delete',   'deleteOp', 'danger'],
      ['Traverse', 'traverse', ''],
    ],
    traversal: [],
    complexity: [
      ['Insert head', 'O(1)', 'O(1)', 'O(1)'],
      ['Insert tail', 'O(n)', 'O(n)', 'O(n)'],
      ['Delete',      'O(n)', 'O(n)', 'O(n)'],
      ['Traverse',    'O(n)', 'O(n)', 'O(n)'],
    ],
    code: `<span class="kw">class</span> <span class="fn">CircularLL</span>:
    <span class="kw">def</span> <span class="fn">__init__</span>(self):
        self.head = <span class="kw">None</span>

    <span class="kw">def</span> <span class="fn">insert</span>(self, val):
        node = Node(val)
        <span class="kw">if not</span> self.head:
            node.next = node
            self.head = node
            <span class="kw">return</span>
        temp = self.head
        <span class="kw">while</span> temp.next != self.head:
            temp = temp.next
        temp.next = node
        node.next = self.head  <span class="cm"># circular link</span>`,
  },

  /* ── STACK ── */
  stack: {
    icon: '🗂️', title: 'Stack', page: 'linear',
    desc: 'LIFO — Last In, First Out linear structure',
    ops: [
      ['Push', 'push', 'success'],
      ['Pop',  'pop',  'danger'],
      ['Peek', 'peek', ''],
    ],
    traversal: [],
    complexity: [
      ['Push',   'O(1)', 'O(1)', 'O(1)'],
      ['Pop',    'O(1)', 'O(1)', 'O(1)'],
      ['Peek',   'O(1)', 'O(1)', 'O(1)'],
      ['Search', 'O(n)', 'O(n)', 'O(n)'],
    ],
    code: `<span class="kw">class</span> <span class="fn">Stack</span>:
    <span class="kw">def</span> <span class="fn">__init__</span>(self):
        self.items = []

    <span class="kw">def</span> <span class="fn">push</span>(self, val):
        self.items.append(val)  <span class="cm"># O(1)</span>

    <span class="kw">def</span> <span class="fn">pop</span>(self):
        <span class="kw">if not</span> self.is_empty():
            <span class="kw">return</span> self.items.pop()  <span class="cm"># O(1)</span>

    <span class="kw">def</span> <span class="fn">peek</span>(self):
        <span class="kw">return</span> self.items[-<span class="nm">1</span>] <span class="kw">if</span> self.items <span class="kw">else None</span>

    <span class="kw">def</span> <span class="fn">is_empty</span>(self):
        <span class="kw">return</span> <span class="fn">len</span>(self.items) == <span class="nm">0</span>`,
  },

  /* ── SIMPLE QUEUE ── */
  simplequeue: {
    icon: '➡️', title: 'Simple Queue', page: 'linear',
    desc: 'FIFO — First In, First Out structure',
    ops: [
      ['Enqueue', 'enqueue', 'success'],
      ['Dequeue', 'dequeue', 'danger'],
      ['Front',   'front',   ''],
      ['Rear',    'rear',    ''],
    ],
    traversal: [],
    complexity: [
      ['Enqueue',    'O(1)', 'O(1)', 'O(1)'],
      ['Dequeue',    'O(1)', 'O(1)', 'O(1)'],
      ['Front/Rear', 'O(1)', 'O(1)', 'O(1)'],
      ['Search',     'O(n)', 'O(n)', 'O(n)'],
    ],
    code: `<span class="kw">from</span> collections <span class="kw">import</span> deque

<span class="kw">class</span> <span class="fn">Queue</span>:
    <span class="kw">def</span> <span class="fn">__init__</span>(self):
        self.q = deque()

    <span class="kw">def</span> <span class="fn">enqueue</span>(self, val):
        self.q.append(val)  <span class="cm"># rear  O(1)</span>

    <span class="kw">def</span> <span class="fn">dequeue</span>(self):
        <span class="kw">if not</span> self.is_empty():
            <span class="kw">return</span> self.q.popleft()  <span class="cm"># front O(1)</span>

    <span class="kw">def</span> <span class="fn">front</span>(self): <span class="kw">return</span> self.q[<span class="nm">0</span>]  <span class="kw">if</span> self.q <span class="kw">else None</span>
    <span class="kw">def</span> <span class="fn">rear</span>(self):  <span class="kw">return</span> self.q[-<span class="nm">1</span>] <span class="kw">if</span> self.q <span class="kw">else None</span>`,
  },

  /* ── CIRCULAR QUEUE ── */
  circularqueue: {
    icon: '🔁', title: 'Circular Queue', page: 'linear',
    desc: 'Ring buffer with wrap-around front/rear pointers',
    ops: [
      ['Enqueue', 'enqueue', 'success'],
      ['Dequeue', 'dequeue', 'danger'],
    ],
    traversal: [],
    complexity: [
      ['Enqueue',    'O(1)', 'O(1)', 'O(1)'],
      ['Dequeue',    'O(1)', 'O(1)', 'O(1)'],
      ['Front/Rear', 'O(1)', 'O(1)', 'O(1)'],
      ['Space',      'O(n)', 'O(n)', 'O(n)'],
    ],
    code: `<span class="kw">class</span> <span class="fn">CircularQueue</span>:
    <span class="kw">def</span> <span class="fn">__init__</span>(self, cap):
        self.cap   = cap
        self.q     = [<span class="kw">None</span>] * cap
        self.front = self.rear = -<span class="nm">1</span>

    <span class="kw">def</span> <span class="fn">enqueue</span>(self, val):
        <span class="kw">if</span> (self.rear + <span class="nm">1</span>) % self.cap == self.front:
            <span class="kw">return</span>  <span class="cm"># full</span>
        self.rear      = (self.rear + <span class="nm">1</span>) % self.cap
        self.q[self.rear] = val

    <span class="kw">def</span> <span class="fn">dequeue</span>(self):
        self.front = (self.front + <span class="nm">1</span>) % self.cap
        <span class="kw">return</span> self.q[self.front]`,
  },

  /* ── PRIORITY QUEUE ── */
  priorityqueue: {
    icon: '⭐', title: 'Priority Queue', page: 'linear',
    desc: 'Elements dequeued by priority (lower number = higher priority)',
    ops: [
      ['Insert',                 'insert',    'success'],
      ['Delete Highest Priority','deleteMax', 'danger'],
    ],
    traversal: [],
    complexity: [
      ['Insert',          'O(log n)', 'O(log n)', 'O(log n)'],
      ['Delete Max Prio', 'O(log n)', 'O(log n)', 'O(log n)'],
      ['Peek Max',        'O(1)',     'O(1)',     'O(1)'],
      ['Space',           'O(n)',     'O(n)',     'O(n)'],
    ],
    code: `<span class="kw">import</span> heapq

<span class="kw">class</span> <span class="fn">PriorityQueue</span>:
    <span class="kw">def</span> <span class="fn">__init__</span>(self):
        self.heap = []

    <span class="kw">def</span> <span class="fn">insert</span>(self, val, priority):
        heapq.heappush(self.heap, (priority, val))

    <span class="kw">def</span> <span class="fn">delete_max</span>(self):
        <span class="kw">if</span> self.heap:
            <span class="kw">return</span> heapq.heappop(self.heap)  <span class="cm"># O(log n)</span>

    <span class="kw">def</span> <span class="fn">peek</span>(self):
        <span class="kw">return</span> self.heap[<span class="nm">0</span>] <span class="kw">if</span> self.heap <span class="kw">else None</span>`,
  },

  /* ── DEQUE ── */
  deque: {
    icon: '↔️', title: 'Deque (Double-Ended Queue)', page: 'linear',
    desc: 'Insert and delete from both ends in O(1)',
    ops: [
      ['Insert Front', 'insertFront', 'success'],
      ['Insert Rear',  'insertRear',  'success'],
      ['Delete Front', 'deleteFront', 'danger'],
      ['Delete Rear',  'deleteRear',  'danger'],
    ],
    traversal: [],
    complexity: [
      ['Insert Front/Rear', 'O(1)', 'O(1)', 'O(1)'],
      ['Delete Front/Rear', 'O(1)', 'O(1)', 'O(1)'],
      ['Access',            'O(n)', 'O(n)', 'O(n)'],
      ['Search',            'O(n)', 'O(n)', 'O(n)'],
    ],
    code: `<span class="kw">from</span> collections <span class="kw">import</span> deque

<span class="kw">class</span> <span class="fn">Deque</span>:
    <span class="kw">def</span> <span class="fn">__init__</span>(self):
        self.dq = deque()

    <span class="kw">def</span> <span class="fn">insert_front</span>(self, val):
        self.dq.appendleft(val)  <span class="cm"># O(1)</span>

    <span class="kw">def</span> <span class="fn">insert_rear</span>(self, val):
        self.dq.append(val)      <span class="cm"># O(1)</span>

    <span class="kw">def</span> <span class="fn">delete_front</span>(self):
        <span class="kw">return</span> self.dq.popleft()  <span class="cm"># O(1)</span>

    <span class="kw">def</span> <span class="fn">delete_rear</span>(self):
        <span class="kw">return</span> self.dq.pop()      <span class="cm"># O(1)</span>`,
  },

  /* ── BINARY TREE ── */
  binarytree: {
    icon: '🌲', title: 'Binary Tree', page: 'nonlinear',
    desc: 'Hierarchical tree where each node has at most 2 children',
    ops: [
      ['Insert', 'insert',   'success'],
      ['Delete', 'deleteOp', 'danger'],
    ],
    traversal: [
      ['Inorder',     'inorder'],
      ['Preorder',    'preorder'],
      ['Postorder',   'postorder'],
      ['Level Order', 'levelorder'],
    ],
    complexity: [
      ['Search',  'O(n)', 'O(n)', 'O(n)'],
      ['Insert',  'O(n)', 'O(n)', 'O(n)'],
      ['Delete',  'O(n)', 'O(n)', 'O(n)'],
      ['Height',  'O(n)', 'O(n)', 'O(n)'],
    ],
    code: `<span class="kw">class</span> <span class="fn">BinaryTree</span>:
    <span class="kw">def</span> <span class="fn">insert</span>(self, root, val):
        <span class="kw">if not</span> root: <span class="kw">return</span> Node(val)
        queue = [root]
        <span class="kw">while</span> queue:
            node = queue.pop(<span class="nm">0</span>)
            <span class="kw">if not</span> node.left:
                node.left = Node(val); <span class="kw">return</span> root
            queue.append(node.left)
            <span class="kw">if not</span> node.right:
                node.right = Node(val); <span class="kw">return</span> root
            queue.append(node.right)
        <span class="kw">return</span> root`,
  },

  /* ── BST ── */
  bst: {
    icon: '🔍', title: 'Binary Search Tree', page: 'nonlinear',
    desc: 'Left < root < right — efficient search, insert, delete',
    ops: [
      ['Insert', 'insert',   'success'],
      ['Delete', 'deleteOp', 'danger'],
      ['Search', 'search',   ''],
    ],
    traversal: [
      ['Inorder',     'inorder'],
      ['Preorder',    'preorder'],
      ['Postorder',   'postorder'],
      ['Level Order', 'levelorder'],
    ],
    complexity: [
      ['Search', 'O(log n)', 'O(log n)', 'O(n)'],
      ['Insert', 'O(log n)', 'O(log n)', 'O(n)'],
      ['Delete', 'O(log n)', 'O(log n)', 'O(n)'],
      ['Traverse','O(n)',    'O(n)',     'O(n)'],
    ],
    code: `<span class="kw">class</span> <span class="fn">BST</span>:
    <span class="kw">def</span> <span class="fn">__init__</span>(self):
        self.root = <span class="kw">None</span>

    <span class="kw">def</span> <span class="fn">insert</span>(self, root, val):
        <span class="kw">if not</span> root: <span class="kw">return</span> Node(val)
        <span class="kw">if</span> val < root.val:
            root.left  = self.insert(root.left,  val)
        <span class="kw">elif</span> val > root.val:
            root.right = self.insert(root.right, val)
        <span class="kw">return</span> root

    <span class="kw">def</span> <span class="fn">inorder</span>(self, root, res=[]):
        <span class="kw">if</span> root:
            self.inorder(root.left,  res)
            res.append(root.val)
            self.inorder(root.right, res)
        <span class="kw">return</span> res`,
  },

  /* ── AVL ── */
  avl: {
    icon: '⚖️', title: 'AVL Tree', page: 'nonlinear',
    desc: 'Self-balancing BST — height difference ≤ 1 at all nodes',
    ops: [
      ['Insert', 'insert',   'success'],
      ['Delete', 'deleteOp', 'danger'],
    ],
    traversal: [
      ['Inorder',     'inorder'],
      ['Level Order', 'levelorder'],
    ],
    complexity: [
      ['Search',  'O(log n)', 'O(log n)', 'O(log n)'],
      ['Insert',  'O(log n)', 'O(log n)', 'O(log n)'],
      ['Delete',  'O(log n)', 'O(log n)', 'O(log n)'],
      ['Balance', 'O(1)',     'O(1)',     'O(1)'],
    ],
    code: `<span class="kw">def</span> <span class="fn">rotate_right</span>(z):
    y = z.left;  T3 = y.right
    y.right = z; z.left = T3
    z.height = <span class="nm">1</span> + max(height(z.left), height(z.right))
    y.height = <span class="nm">1</span> + max(height(y.left), height(y.right))
    <span class="kw">return</span> y

<span class="kw">def</span> <span class="fn">rotate_left</span>(z):
    y = z.right; T2 = y.left
    y.left  = z; z.right = T2
    z.height = <span class="nm">1</span> + max(height(z.left), height(z.right))
    y.height = <span class="nm">1</span> + max(height(y.left), height(y.right))
    <span class="kw">return</span> y`,
  },

  /* ── MIN HEAP ── */
  minheap: {
    icon: '⬇️', title: 'Min Heap', page: 'nonlinear',
    desc: 'Parent is always ≤ children — root holds the minimum',
    ops: [
      ['Insert',                  'insert',     'success'],
      ['Delete Root (Extract Min)', 'deleteRoot', 'danger'],
    ],
    traversal: [],
    complexity: [
      ['Insert',      'O(log n)', 'O(log n)', 'O(log n)'],
      ['Extract Min', 'O(log n)', 'O(log n)', 'O(log n)'],
      ['Peek Min',    'O(1)',     'O(1)',     'O(1)'],
      ['Heapify',     'O(n)',     'O(n)',     'O(n)'],
    ],
    code: `<span class="kw">import</span> heapq

<span class="kw">class</span> <span class="fn">MinHeap</span>:
    <span class="kw">def</span> <span class="fn">__init__</span>(self):
        self.heap = []

    <span class="kw">def</span> <span class="fn">insert</span>(self, val):
        heapq.heappush(self.heap, val)   <span class="cm"># O(log n)</span>

    <span class="kw">def</span> <span class="fn">extract_min</span>(self):
        <span class="kw">return</span> heapq.heappop(self.heap)  <span class="cm"># O(log n)</span>

    <span class="kw">def</span> <span class="fn">peek</span>(self):
        <span class="kw">return</span> self.heap[<span class="nm">0</span>]             <span class="cm"># O(1)</span>`,
  },

  /* ── MAX HEAP ── */
  maxheap: {
    icon: '⬆️', title: 'Max Heap', page: 'nonlinear',
    desc: 'Parent is always ≥ children — root holds the maximum',
    ops: [
      ['Insert',                  'insert',     'success'],
      ['Delete Root (Extract Max)', 'deleteRoot', 'danger'],
    ],
    traversal: [],
    complexity: [
      ['Insert',      'O(log n)', 'O(log n)', 'O(log n)'],
      ['Extract Max', 'O(log n)', 'O(log n)', 'O(log n)'],
      ['Peek Max',    'O(1)',     'O(1)',     'O(1)'],
      ['Heapify',     'O(n)',     'O(n)',     'O(n)'],
    ],
    code: `<span class="kw">import</span> heapq

<span class="kw">class</span> <span class="fn">MaxHeap</span>:
    <span class="kw">def</span> <span class="fn">__init__</span>(self):
        self.heap = []

    <span class="kw">def</span> <span class="fn">insert</span>(self, val):
        heapq.heappush(self.heap, -val)   <span class="cm"># negate → max</span>

    <span class="kw">def</span> <span class="fn">extract_max</span>(self):
        <span class="kw">return</span> -heapq.heappop(self.heap)

    <span class="kw">def</span> <span class="fn">peek</span>(self):
        <span class="kw">return</span> -self.heap[<span class="nm">0</span>]`,
  },

  /* ── DIRECTED GRAPH ── */
  directedgraph: {
    icon: '➡️', title: 'Directed Graph', page: 'nonlinear',
    desc: 'Edges have direction: edge (u→v) ≠ edge (v→u)',
    ops: [
      ['Add Node',    'addNode',    'success'],
      ['Add Edge',    'addEdge',    'success'],
      ['Remove Node', 'removeNode', 'danger'],
      ['Remove Edge', 'removeEdge', 'danger'],
    ],
    traversal: [['BFS', 'bfs'], ['DFS', 'dfs']],
    complexity: [
      ['Add Node',  'O(1)',   'O(1)',   'O(1)'],
      ['Add Edge',  'O(1)',   'O(1)',   'O(1)'],
      ['BFS / DFS', 'O(V+E)', 'O(V+E)', 'O(V+E)'],
      ['Space',     'O(V+E)', 'O(V+E)', 'O(V+E)'],
    ],
    code: `<span class="kw">from</span> collections <span class="kw">import</span> defaultdict, deque

<span class="kw">class</span> <span class="fn">DirectedGraph</span>:
    <span class="kw">def</span> <span class="fn">__init__</span>(self):
        self.adj = defaultdict(list)

    <span class="kw">def</span> <span class="fn">add_edge</span>(self, u, v):
        self.adj[u].append(v)  <span class="cm"># one-way</span>

    <span class="kw">def</span> <span class="fn">bfs</span>(self, start):
        visited = set(); q = deque([start])
        visited.add(start)
        <span class="kw">while</span> q:
            node = q.popleft()
            <span class="kw">for</span> nb <span class="kw">in</span> self.adj[node]:
                <span class="kw">if</span> nb <span class="kw">not in</span> visited:
                    visited.add(nb); q.append(nb)`,
  },

  /* ── UNDIRECTED GRAPH ── */
  undirectedgraph: {
    icon: '🔗', title: 'Undirected Graph', page: 'nonlinear',
    desc: 'Edges are bidirectional — (u,v) same as (v,u)',
    ops: [
      ['Add Node',    'addNode',    'success'],
      ['Add Edge',    'addEdge',    'success'],
      ['Remove Node', 'removeNode', 'danger'],
      ['Remove Edge', 'removeEdge', 'danger'],
    ],
    traversal: [['BFS', 'bfs'], ['DFS', 'dfs']],
    complexity: [
      ['Add Node',  'O(1)',   'O(1)',   'O(1)'],
      ['Add Edge',  'O(1)',   'O(1)',   'O(1)'],
      ['BFS / DFS', 'O(V+E)', 'O(V+E)', 'O(V+E)'],
      ['Space',     'O(V+E)', 'O(V+E)', 'O(V+E)'],
    ],
    code: `<span class="kw">class</span> <span class="fn">UndirectedGraph</span>:
    <span class="kw">def</span> <span class="fn">__init__</span>(self):
        self.adj = defaultdict(list)

    <span class="kw">def</span> <span class="fn">add_edge</span>(self, u, v):
        self.adj[u].append(v)
        self.adj[v].append(u)  <span class="cm"># bidirectional</span>

    <span class="kw">def</span> <span class="fn">dfs</span>(self, node, visited=<span class="kw">None</span>):
        <span class="kw">if</span> visited <span class="kw">is None</span>: visited = set()
        visited.add(node)
        <span class="kw">for</span> nb <span class="kw">in</span> self.adj[node]:
            <span class="kw">if</span> nb <span class="kw">not in</span> visited:
                self.dfs(nb, visited)`,
  },

  /* ── WEIGHTED GRAPH ── */
  weightedgraph: {
    icon: '⚖️', title: 'Weighted Graph', page: 'nonlinear',
    desc: 'Edges carry numeric weights — basis for shortest-path algorithms',
    ops: [
      ['Add Node',    'addNode',    'success'],
      ['Add Edge',    'addEdge',    'success'],
      ['Remove Node', 'removeNode', 'danger'],
    ],
    traversal: [['BFS', 'bfs'], ['DFS', 'dfs']],
    complexity: [
      ['Add Node', 'O(1)',          'O(1)',          'O(1)'],
      ['Add Edge', 'O(1)',          'O(1)',          'O(1)'],
      ['Dijkstra', 'O((V+E)log V)', 'O((V+E)log V)', 'O((V+E)log V)'],
      ['Space',    'O(V+E)',        'O(V+E)',        'O(V+E)'],
    ],
    code: `<span class="kw">import</span> heapq

<span class="kw">class</span> <span class="fn">WeightedGraph</span>:
    <span class="kw">def</span> <span class="fn">__init__</span>(self):
        self.adj = defaultdict(list)

    <span class="kw">def</span> <span class="fn">add_edge</span>(self, u, v, w):
        self.adj[u].append((v, w))

    <span class="kw">def</span> <span class="fn">dijkstra</span>(self, start):
        dist = {start: <span class="nm">0</span>}; pq = [(<span class="nm">0</span>, start)]
        <span class="kw">while</span> pq:
            d, u = heapq.heappop(pq)
            <span class="kw">for</span> v, w <span class="kw">in</span> self.adj[u]:
                <span class="kw">if</span> d+w < dist.get(v, float(<span class="st">'inf'</span>)):
                    dist[v] = d+w
                    heapq.heappush(pq, (d+w, v))`,
  },

  /* ── TRIE ── */
  trie: {
    icon: '📝', title: 'Trie', page: 'nonlinear',
    desc: 'Prefix tree — efficient string insert, search, and autocomplete',
    ops: [
      ['Insert Word',    'insert',       'success'],
      ['Search Word',    'search',       ''],
      ['Prefix Search',  'prefixSearch', ''],
    ],
    traversal: [],
    complexity: [
      ['Insert',       'O(m)', 'O(m)', 'O(m)'],
      ['Search',       'O(m)', 'O(m)', 'O(m)'],
      ['Prefix Search','O(m)', 'O(m)', 'O(m)'],
      ['Space',        'O(n×m)','O(n×m)','O(n×m)'],
    ],
    code: `<span class="kw">class</span> <span class="fn">TrieNode</span>:
    <span class="kw">def</span> <span class="fn">__init__</span>(self):
        self.children = {}
        self.is_end   = <span class="kw">False</span>

<span class="kw">class</span> <span class="fn">Trie</span>:
    <span class="kw">def</span> <span class="fn">__init__</span>(self):
        self.root = TrieNode()

    <span class="kw">def</span> <span class="fn">insert</span>(self, word):
        node = self.root
        <span class="kw">for</span> ch <span class="kw">in</span> word:
            <span class="kw">if</span> ch <span class="kw">not in</span> node.children:
                node.children[ch] = TrieNode()
            node = node.children[ch]
        node.is_end = <span class="kw">True</span>

    <span class="kw">def</span> <span class="fn">search</span>(self, word):
        node = self.root
        <span class="kw">for</span> ch <span class="kw">in</span> word:
            <span class="kw">if</span> ch <span class="kw">not in</span> node.children: <span class="kw">return False</span>
            node = node.children[ch]
        <span class="kw">return</span> node.is_end`,
  },
};
// ── LOGGING ───────────────────────────────────────────────────
function log(msg) {
  document.getElementById('msgLog').textContent = '▸ ' + msg;
}

// ── DISPATCH ─────────────────────────────────────────────────
function handleOp(fn) {
  const val  = document.getElementById('vizInput').value.trim();
  const val2 = document.getElementById('vizInput2').value.trim();
  const num  = parseFloat(val);

  switch (currentViz) {
    case 'array':          arrayOp(fn, num, val); break;
    case 'singly':         singlyOp(fn, num); break;
    case 'doubly':         doublyOp(fn, num); break;
    case 'circular':       circularOp(fn, num); break;
    case 'stack':          stackOp(fn, num); break;
    case 'simplequeue':    sqOp(fn, num); break;
    case 'circularqueue':  cqOp(fn, num); break;
    case 'priorityqueue':  pqOp(fn, num, parseFloat(val2) || 1); break;
    case 'deque':          dqOp(fn, num); break;
    case 'bst':
    case 'binarytree':
    case 'avl':            treeOp(fn, num); break;
    case 'minheap':
    case 'maxheap':        heapOp(fn, num); break;
    case 'directedgraph':
    case 'undirectedgraph':
    case 'weightedgraph':  graphOp(fn, val, val2); break;
    case 'trie':           trieOp(fn, val.toLowerCase()); break;
  }
  renderViz();
}

// ── TRAVERSAL DISPATCH ────────────────────────────────────────
function handleTraversal(type) {
  const sorted = [...treeData].sort((a, b) => a - b);
  switch (type) {
    case 'inorder':    log('Inorder: '    + sorted.join(' → ')); break;
    case 'preorder':   log('Preorder: '   + preorderArr(treeData).join(' → ')); break;
    case 'postorder':  log('Postorder: '  + postorderArr(treeData).join(' → ')); break;
    case 'levelorder': log('Level Order: '+ treeData.join(' → ')); break;
    case 'bfs': graphBFS(); break;
    case 'dfs': graphDFS(); break;
  }
}

// ── ARRAY ─────────────────────────────────────────────────────
function arrayOp(fn, num) {
  switch (fn) {
    case 'insert':
      if (!isNaN(num)) { arrayData.push(num); log(`Inserted ${num} at index ${arrayData.length - 1}`); }
      break;
    case 'deleteOp':
      if (arrayData.length) { log(`Deleted ${arrayData.pop()} from end`); }
      break;
    case 'search': {
      const idx = arrayData.indexOf(num);
      log(idx >= 0 ? `Found ${num} at index ${idx}` : `${num} not found`);
      highlightIdx = idx;
      setTimeout(() => { highlightIdx = -1; renderViz(); }, 1200);
      break;
    }
    case 'update':
      if (!isNaN(num) && arrayData.length) { arrayData[arrayData.length - 1] = num; log(`Updated last element to ${num}`); }
      break;
  }
}

// ── SINGLY ────────────────────────────────────────────────────
function singlyOp(fn, num) {
  switch (fn) {
    case 'insertHead': if (!isNaN(num)) { linkedData.unshift(num); log(`Inserted ${num} at head`); } break;
    case 'insertTail': if (!isNaN(num)) { linkedData.push(num);    log(`Inserted ${num} at tail`); } break;
    case 'deleteHead': if (linkedData.length) { log(`Deleted head: ${linkedData.shift()}`); } break;
    case 'search': {
      const i = linkedData.indexOf(num);
      log(i >= 0 ? `Found ${num} at position ${i}` : `${num} not found`);
      break;
    }
  }
}

// ── DOUBLY ────────────────────────────────────────────────────
function doublyOp(fn, num) {
  switch (fn) {
    case 'insertHead': if (!isNaN(num)) { doublyData.unshift(num); log(`Inserted ${num} at head`); } break;
    case 'insertTail': if (!isNaN(num)) { doublyData.push(num);    log(`Inserted ${num} at tail`); } break;
    case 'deleteHead': if (doublyData.length) { log(`Deleted head: ${doublyData.shift()}`); } break;
    case 'deleteTail': if (doublyData.length) { log(`Deleted tail: ${doublyData.pop()}`);   } break;
  }
}

// ── CIRCULAR LL ───────────────────────────────────────────────
function circularOp(fn, num) {
  switch (fn) {
    case 'insert':   if (!isNaN(num)) { circularData.push(num);    log(`Inserted ${num}`); } break;
    case 'deleteOp': if (circularData.length) { log(`Deleted ${circularData.shift()}`); }   break;
    case 'traverse': log(`Traverse: ${circularData.join(' → ')} → (head)`);                 break;
  }
}

// ── STACK ─────────────────────────────────────────────────────
function stackOp(fn, num) {
  switch (fn) {
    case 'push':
      if (!isNaN(num)) { stackData.push(num); log(`Pushed ${num}`); }
      break;
    case 'pop':
      stackData.length ? log(`Popped: ${stackData.pop()}`) : log('Stack is empty!');
      break;
    case 'peek':
      stackData.length ? log(`Top (Peek): ${stackData[stackData.length - 1]}`) : log('Stack is empty!');
      break;
  }
}

// ── SIMPLE QUEUE ──────────────────────────────────────────────
function sqOp(fn, num) {
  switch (fn) {
    case 'enqueue': if (!isNaN(num)) { simpleQueueData.push(num); log(`Enqueued ${num} to rear`); } break;
    case 'dequeue': simpleQueueData.length ? log(`Dequeued: ${simpleQueueData.shift()}`) : log('Queue is empty!'); break;
    case 'front':   log(simpleQueueData.length ? `Front: ${simpleQueueData[0]}`                     : 'Queue empty'); break;
    case 'rear':    log(simpleQueueData.length ? `Rear: ${simpleQueueData[simpleQueueData.length-1]}`: 'Queue empty'); break;
  }
}

// ── CIRCULAR QUEUE ────────────────────────────────────────────
function cqOp(fn, num) {
  switch (fn) {
    case 'enqueue':
      if (circularQueueData.length < CQ_CAP) {
        if (!isNaN(num)) { circularQueueData.push(num); log(`Enqueued ${num}`); }
      } else { log('Circular Queue is full!'); }
      break;
    case 'dequeue':
      circularQueueData.length ? log(`Dequeued: ${circularQueueData.shift()}`) : log('Queue is empty!');
      break;
  }
}

// ── PRIORITY QUEUE ────────────────────────────────────────────
function pqOp(fn, val, priority) {
  switch (fn) {
    case 'insert':
      if (!isNaN(val)) {
        priorityQueueData.push({ v: val, p: priority });
        priorityQueueData.sort((a, b) => a.p - b.p);
        log(`Inserted ${val} with priority ${priority}`);
      }
      break;
    case 'deleteMax':
      if (priorityQueueData.length) {
        const it = priorityQueueData.shift();
        log(`Removed highest priority: ${it.v} (P${it.p})`);
      }
      break;
  }
}

// ── DEQUE ─────────────────────────────────────────────────────
function dqOp(fn, num) {
  switch (fn) {
    case 'insertFront': if (!isNaN(num)) { dequeData.unshift(num); log(`Inserted ${num} at front`); } break;
    case 'insertRear':  if (!isNaN(num)) { dequeData.push(num);    log(`Inserted ${num} at rear`);  } break;
    case 'deleteFront': dequeData.length ? log(`Deleted from front: ${dequeData.shift()}`) : log('Deque empty'); break;
    case 'deleteRear':  dequeData.length ? log(`Deleted from rear: ${dequeData.pop()}`)    : log('Deque empty'); break;
  }
}

// ── TREE ──────────────────────────────────────────────────────
function treeOp(fn, num) {
  if (fn === 'insert' && !isNaN(num)) {
    treeData.push(num);
    log(`Inserted ${num} into tree`);
  } else if (fn === 'deleteOp' && !isNaN(num)) {
    const i = treeData.indexOf(num);
    i >= 0 ? (treeData.splice(i, 1), log(`Deleted ${num}`)) : log(`${num} not found`);
  } else if (fn === 'search') {
    log(treeData.includes(num) ? `Found ${num} in tree` : `${num} not found`);
  }
}

function preorderArr(arr) {
  if (!arr.length) return [];
  const sorted = [...arr].sort((a, b) => a - b);
  const mid    = Math.floor(sorted.length / 2);
  return [sorted[mid], ...preorderArr(sorted.slice(0, mid)), ...preorderArr(sorted.slice(mid + 1))];
}
function postorderArr(arr) {
  if (!arr.length) return [];
  const sorted = [...arr].sort((a, b) => a - b);
  const mid    = Math.floor(sorted.length / 2);
  return [...postorderArr(sorted.slice(0, mid)), ...postorderArr(sorted.slice(mid + 1)), sorted[mid]];
}

// ── HEAP ──────────────────────────────────────────────────────
function heapOp(fn, num) {
  if (fn === 'insert' && !isNaN(num)) {
    heapData.push(num);
    heapify(heapData, heapType);
    log(`Inserted ${num} into ${heapType} heap`);
  } else if (fn === 'deleteRoot') {
    if (heapData.length) {
      const root = heapData[0];
      heapData[0] = heapData[heapData.length - 1];
      heapData.pop();
      heapifyDown(heapData, 0, heapType);
      log(`Extracted root: ${root}`);
    }
  }
}
function heapify(arr, type) {
  for (let i = Math.floor(arr.length / 2) - 1; i >= 0; i--) heapifyDown(arr, i, type);
}
function heapifyDown(arr, i, type) {
  const n   = arr.length;
  let best  = i, l = 2 * i + 1, r = 2 * i + 2;
  const cmp = type === 'min' ? (a, b) => a < b : (a, b) => a > b;
  if (l < n && cmp(arr[l], arr[best])) best = l;
  if (r < n && cmp(arr[r], arr[best])) best = r;
  if (best !== i) { [arr[i], arr[best]] = [arr[best], arr[i]]; heapifyDown(arr, best, type); }
}

// ── GRAPH ─────────────────────────────────────────────────────
function graphOp(fn, val, val2) {
  switch (fn) {
    case 'addNode':
      if (val && !graphNodes.find(n => n.id === val)) {
        const angle = Math.random() * Math.PI * 2;
        const rad   = 100 + Math.random() * 70;
        graphNodes.push({ id: val, x: 230 + rad * Math.cos(angle), y: 180 + rad * Math.sin(angle) });
        log(`Added node ${val}`);
      }
      break;
    case 'addEdge': {
      if (!val || !val2) break;
      const u = val, parts = val2.split(','), v = parts[0].trim(), w = parseFloat(parts[1]) || 1;
      if (!graphEdges.find(e => e.u === u && e.v === v)) {
        graphEdges.push({ u, v, w });
        if (!graphDirected && !graphEdges.find(e => e.u === v && e.v === u))
          graphEdges.push({ u: v, v: u, w });
        log(`Added edge ${u}→${v}${graphWeighted ? ` (w=${w})` : ''}`);
      }
      break;
    }
    case 'removeNode':
      graphNodes = graphNodes.filter(n => n.id !== val);
      graphEdges = graphEdges.filter(e => e.u !== val && e.v !== val);
      log(`Removed node ${val}`);
      break;
    case 'removeEdge':
      if (val && val2) {
        graphEdges = graphEdges.filter(e => !(e.u === val && e.v === val2));
        log(`Removed edge ${val}→${val2}`);
      }
      break;
  }
}
function graphBFS() {
  if (!graphNodes.length) return;
  const start   = graphNodes[0].id;
  const visited = [], queue = [start], seen = new Set([start]);
  while (queue.length) {
    const n = queue.shift(); visited.push(n);
    graphEdges.filter(e => e.u === n).forEach(e => { if (!seen.has(e.v)) { seen.add(e.v); queue.push(e.v); } });
  }
  log('BFS: ' + visited.join(' → '));
}
function graphDFS() {
  if (!graphNodes.length) return;
  const visited = [], seen = new Set();
  function dfs(n) { seen.add(n); visited.push(n); graphEdges.filter(e => e.u === n && !seen.has(e.v)).forEach(e => dfs(e.v)); }
  dfs(graphNodes[0].id);
  log('DFS: ' + visited.join(' → '));
}

// ── TRIE ──────────────────────────────────────────────────────
function insertTrieWord(word, root) {
  let node = root;
  for (const ch of word) {
    if (!node.children[ch]) node.children[ch] = { c: ch, children: {}, end: false };
    node = node.children[ch];
  }
  node.end = true;
}
function trieOp(fn, word) {
  if (!word) { log('Enter a word first'); return; }
  switch (fn) {
    case 'insert':
      if (!trieWords.includes(word)) { trieWords.push(word); insertTrieWord(word, trieRoot); }
      log(`Inserted "${word}" into trie`);
      break;
    case 'search': {
      let n = trieRoot;
      for (const ch of word) { if (!n.children[ch]) { log(`"${word}" not found`); return; } n = n.children[ch]; }
      log(n.end ? `"${word}" found ✓` : `"${word}" is a prefix only`);
      break;
    }
    case 'prefixSearch': {
      let pn = trieRoot;
      for (const ch of word) { if (!pn.children[ch]) { log(`No words with prefix "${word}"`); return; } pn = pn.children[ch]; }
      const results = [];
      function collect(node, prefix) { if (node.end) results.push(prefix); Object.entries(node.children).forEach(([c, child]) => collect(child, prefix + c)); }
      collect(pn, word);
      log(`Prefix "${word}": [${results.join(', ')}]`);
      break;
    }
  }
}
// ── MAIN RENDER DISPATCHER ───────────────────────────────────
function renderViz() {
  const area = document.getElementById('canvasArea');
  area.innerHTML = '';
  switch (currentViz) {
    case 'array':          renderArray(area);         break;
    case 'singly':         renderSingly(area);        break;
    case 'doubly':         renderDoubly(area);        break;
    case 'circular':       renderCircular(area);      break;
    case 'stack':          renderStack(area);         break;
    case 'simplequeue':    renderSimpleQueue(area);   break;
    case 'circularqueue':  renderCircularQueue(area); break;
    case 'priorityqueue':  renderPriorityQueue(area); break;
    case 'deque':          renderDeque(area);         break;
    case 'bst':
    case 'binarytree':
    case 'avl':            renderTree(area);          break;
    case 'minheap':
    case 'maxheap':        renderHeap(area);          break;
    case 'directedgraph':
    case 'undirectedgraph':
    case 'weightedgraph':  renderGraph(area);         break;
    case 'trie':           renderTrie(area);          break;
  }
}

// ── HELPERS ───────────────────────────────────────────────────
function makeNode(val, extra = '') {
  const d = document.createElement('div');
  d.className = 'node' + (extra ? ' ' + extra : '');
  d.textContent = val;
  return d;
}
function makeArrow(text = '→') {
  const s = document.createElement('span');
  s.className = 'arrow'; s.textContent = text;
  return s;
}
function emptySvgText(svg, w, h, msg) {
  const t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  t.setAttribute('x', w / 2); t.setAttribute('y', h / 2);
  t.setAttribute('fill', '#6e7681'); t.setAttribute('text-anchor', 'middle');
  t.setAttribute('font-size', '14'); t.textContent = msg;
  svg.appendChild(t);
}
function svgLine(svg, x1, y1, x2, y2, color = '#3b82f6', w = 2, opacity = 0.6) {
  const l = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  [['x1',x1],['y1',y1],['x2',x2],['y2',y2],
   ['stroke',color],['stroke-width',w],['opacity',opacity]].forEach(([k,v])=>l.setAttribute(k,v));
  svg.appendChild(l); return l;
}
function svgCircle(svg, cx, cy, r, fill, stroke, strokeW = 2) {
  const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  [['cx',cx],['cy',cy],['r',r],['fill',fill],['stroke',stroke],['stroke-width',strokeW]].forEach(([k,v])=>c.setAttribute(k,v));
  svg.appendChild(c); return c;
}
function svgText(svg, x, y, text, fill, size = 12, family = 'JetBrains Mono,monospace', weight = '700') {
  const t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  [['x',x],['y',y],['fill',fill],['text-anchor','middle'],['font-size',size],
   ['font-family',family],['font-weight',weight]].forEach(([k,v])=>t.setAttribute(k,v));
  t.textContent = text; svg.appendChild(t); return t;
}
function makeSVG(w, h) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', h);
  svg.setAttribute('style', 'overflow:visible;');
  return svg;
}

// ── ARRAY ─────────────────────────────────────────────────────
function renderArray(area) {
  const wrap = document.createElement('div');
  wrap.style.cssText = 'display:flex;align-items:flex-end;gap:6px;flex-wrap:wrap;justify-content:center;';
  if (!arrayData.length) { wrap.textContent = 'Empty array'; wrap.style.color = 'var(--text-muted)'; }
  arrayData.forEach((v, i) => {
    const cell = document.createElement('div');
    cell.className = 'node' + (i === highlightIdx ? ' found' : '');
    cell.style.cssText = 'position:relative;animation:fadeIn 0.3s ease;';
    const idx = document.createElement('span');
    idx.className = 'node-index'; idx.textContent = `[${i}]`;
    cell.appendChild(idx);
    cell.appendChild(document.createTextNode(v));
    wrap.appendChild(cell);
  });
  area.appendChild(wrap);
}

// ── SINGLY ────────────────────────────────────────────────────
function renderSingly(area) {
  const wrap = document.createElement('div');
  wrap.style.cssText = 'display:flex;align-items:center;gap:4px;flex-wrap:wrap;justify-content:center;';
  linkedData.forEach((v, i) => {
    wrap.appendChild(makeNode(v));
    const arr = makeArrow(i < linkedData.length - 1 ? '→' : '→ NULL');
    if (i === linkedData.length - 1) arr.style.color = 'var(--text-muted)';
    wrap.appendChild(arr);
  });
  if (!linkedData.length) { const e = document.createElement('span'); e.textContent = 'Empty list'; e.style.color = 'var(--text-muted)'; wrap.appendChild(e); }
  area.appendChild(wrap);
}

// ── DOUBLY ────────────────────────────────────────────────────
function renderDoubly(area) {
  const wrap = document.createElement('div');
  wrap.style.cssText = 'display:flex;align-items:center;gap:4px;flex-wrap:wrap;justify-content:center;';
  const n1 = makeArrow('NULL ⇔'); n1.style.color = 'var(--text-muted)'; n1.style.fontSize = '0.8rem';
  wrap.appendChild(n1);
  doublyData.forEach((v, i) => {
    wrap.appendChild(makeNode(v));
    if (i < doublyData.length - 1) wrap.appendChild(makeArrow('⇔'));
  });
  const n2 = makeArrow('⇔ NULL'); n2.style.color = 'var(--text-muted)'; n2.style.fontSize = '0.8rem';
  wrap.appendChild(n2);
  area.appendChild(wrap);
}

// ── CIRCULAR LL ───────────────────────────────────────────────
function renderCircular(area) {
  const wrap = document.createElement('div');
  wrap.style.cssText = 'display:flex;align-items:center;gap:4px;flex-wrap:wrap;justify-content:center;';
  const hl = document.createElement('span');
  hl.style.cssText = 'font-size:0.72rem;color:var(--py-yellow);font-weight:600;margin-right:4px;';
  hl.textContent = 'HEAD↓'; wrap.appendChild(hl);
  circularData.forEach((v, i) => {
    wrap.appendChild(makeNode(v));
    const a = makeArrow(i < circularData.length - 1 ? '→' : '→ (head)');
    if (i === circularData.length - 1) a.style.color = 'var(--py-yellow)';
    wrap.appendChild(a);
  });
  area.appendChild(wrap);
}

// ── STACK ─────────────────────────────────────────────────────
function renderStack(area) {
  const wrap = document.createElement('div');
  wrap.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:4px;';
  if (stackData.length) {
    const lbl = document.createElement('div');
    lbl.style.cssText = 'font-size:0.72rem;color:var(--py-yellow);font-weight:600;letter-spacing:0.1em;margin-bottom:2px;';
    lbl.textContent = '▲ TOP'; wrap.appendChild(lbl);
  }
  [...stackData].reverse().forEach((v, i) => {
    const n = makeNode(v, 'stack-node');
    if (i === 0) n.style.borderColor = 'var(--py-yellow)';
    wrap.appendChild(n);
  });
  if (!stackData.length) { const e = document.createElement('div'); e.textContent = 'Empty stack'; e.style.color = 'var(--text-muted)'; wrap.appendChild(e); }
  const base = document.createElement('div');
  base.style.cssText = 'width:140px;height:3px;background:var(--py-blue);border-radius:2px;margin-top:4px;';
  wrap.appendChild(base);
  area.appendChild(wrap);
}

// ── SIMPLE QUEUE ──────────────────────────────────────────────
function renderSimpleQueue(area) {
  const wrap = document.createElement('div');
  wrap.style.cssText = 'display:flex;align-items:center;gap:6px;flex-wrap:wrap;justify-content:center;';
  const fl = document.createElement('div'); fl.className = 'queue-label'; fl.textContent = 'Front →'; wrap.appendChild(fl);
  simpleQueueData.forEach(v => wrap.appendChild(makeNode(v)));
  if (!simpleQueueData.length) { const e = document.createElement('span'); e.textContent = 'Empty'; e.style.color = 'var(--text-muted)'; wrap.appendChild(e); }
  const rl = document.createElement('div'); rl.className = 'queue-label'; rl.textContent = '← Rear'; wrap.appendChild(rl);
  area.appendChild(wrap);
}

// ── CIRCULAR QUEUE ────────────────────────────────────────────
function renderCircularQueue(area) {
  const canvas = document.createElement('canvas');
  canvas.width = 340; canvas.height = 340;
  canvas.style.cssText = 'width:100%;max-width:340px;';
  area.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  const cx = 170, cy = 170, r = 120;
  ctx.clearRect(0, 0, 340, 340);
  for (let i = 0; i < CQ_CAP; i++) {
    const ang = (i / CQ_CAP) * Math.PI * 2 - Math.PI / 2;
    const x   = cx + r * Math.cos(ang), y = cy + r * Math.sin(ang);
    const val = circularQueueData[i] !== undefined ? circularQueueData[i] : null;
    ctx.beginPath(); ctx.arc(x, y, 30, 0, Math.PI * 2);
    ctx.fillStyle   = val !== null ? 'rgba(30,58,95,0.9)' : 'rgba(22,27,34,0.9)';
    ctx.strokeStyle = val !== null ? '#3b82f6'             : '#30363d';
    ctx.lineWidth = 2; ctx.fill(); ctx.stroke();
    ctx.fillStyle = val !== null ? '#f0f6fc' : '#6e7681';
    ctx.font = 'bold 14px JetBrains Mono,monospace';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(val !== null ? val : '·', x, y);
    if (i === 0)                                        { ctx.fillStyle = '#fbbf24'; ctx.font = '10px Inter,sans-serif'; ctx.fillText('Front', x, y - 44); }
    if (i === circularQueueData.length - 1 && circularQueueData.length > 0) { ctx.fillStyle = '#34d399'; ctx.font = '10px Inter,sans-serif'; ctx.fillText('Rear', x, y + 44); }
  }
  ctx.fillStyle = '#8b949e'; ctx.font = '12px Inter,sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(`${circularQueueData.length}/${CQ_CAP}`, cx, cy);
  ctx.fillText('Capacity', cx, cy + 18);
}

// ── PRIORITY QUEUE ────────────────────────────────────────────
function renderPriorityQueue(area) {
  const wrap = document.createElement('div');
  wrap.style.cssText = 'display:flex;flex-direction:column;gap:6px;align-items:center;min-width:200px;';
  if (priorityQueueData.length) {
    const lbl = document.createElement('div');
    lbl.style.cssText = 'font-size:0.72rem;color:var(--py-yellow);font-weight:600;letter-spacing:0.1em;';
    lbl.textContent = '▲ HIGHEST PRIORITY'; wrap.appendChild(lbl);
  }
  priorityQueueData.forEach(item => {
    const el = document.createElement('div');
    el.className = 'pq-item' + (item.p === 1 ? ' p1' : '');
    el.innerHTML = `<span style="font-family:'JetBrains Mono',monospace;font-weight:700">${item.v}</span><span class="pq-priority">P${item.p}</span>`;
    wrap.appendChild(el);
  });
  if (!priorityQueueData.length) { const e = document.createElement('div'); e.textContent = 'Empty'; e.style.color = 'var(--text-muted)'; wrap.appendChild(e); }
  area.appendChild(wrap);
}

// ── DEQUE ─────────────────────────────────────────────────────
function renderDeque(area) {
  const wrap = document.createElement('div');
  wrap.style.cssText = 'display:flex;align-items:center;gap:6px;flex-wrap:wrap;justify-content:center;';
  const fl = document.createElement('div'); fl.className = 'deque-label'; fl.textContent = '↔ Front'; wrap.appendChild(fl);
  dequeData.forEach(v => wrap.appendChild(makeNode(v)));
  const rl = document.createElement('div'); rl.className = 'deque-label'; rl.textContent = 'Rear ↔'; wrap.appendChild(rl);
  area.appendChild(wrap);
}

// ── TREE ──────────────────────────────────────────────────────
function renderTree(area) {
  const W = 560, H = Math.max(280, treeData.length * 35);
  const svg = makeSVG(W, H);
  const sorted = [...treeData].sort((a, b) => a - b);

  function bstLayout(vals, x, y, xRange) {
    if (!vals.length) return [];
    const mid = Math.floor(vals.length / 2);
    const root = { v: vals[mid], x, y };
    const nodes = [root];
    const xL = (x + xRange[0]) / 2, xR = (x + xRange[1]) / 2;
    const cy  = y + 70;
    const left = vals.slice(0, mid), right = vals.slice(mid + 1);
    if (left.length)  { svgLine(svg, x, y + 22, xL, cy - 22); nodes.push(...bstLayout(left,  xL, cy, [xRange[0], x])); }
    if (right.length) { svgLine(svg, x, y + 22, xR, cy - 22); nodes.push(...bstLayout(right, xR, cy, [x, xRange[1]])); }
    return nodes;
  }

  if (!treeData.length) { emptySvgText(svg, W, H, 'Empty tree — insert values'); }
  else {
    bstLayout(sorted, W / 2, 40, [20, W - 20]).forEach(node => {
      svgCircle(svg, node.x, node.y, 22, '#1e3a5f', '#3b82f6');
      svgText(svg, node.x, node.y + 5, node.v, '#f0f6fc');
    });
  }
  area.appendChild(svg);
}

// ── HEAP ──────────────────────────────────────────────────────
function renderHeap(area) {
  if (!heapData.length) { const e = document.createElement('div'); e.textContent = 'Empty heap — insert values'; e.style.color = 'var(--text-muted)'; area.appendChild(e); return; }
  const levels = Math.ceil(Math.log2(heapData.length + 1));
  const W = Math.max(400, Math.pow(2, levels) * 60);
  const H = levels * 80 + 40;
  const svg = makeSVG(W, H);

  function drawNode(i, x, y, xOff) {
    if (i >= heapData.length) return;
    const l = 2*i+1, r = 2*i+2;
    if (l < heapData.length) { svgLine(svg, x, y+22, x-xOff/2, y+48); drawNode(l, x-xOff/2, y+70, xOff/2); }
    if (r < heapData.length) { svgLine(svg, x, y+22, x+xOff/2, y+48); drawNode(r, x+xOff/2, y+70, xOff/2); }
    const isRoot = i === 0;
    const stroke = isRoot ? (heapType==='min' ? '#34d399' : '#fbbf24') : '#3b82f6';
    const fill   = isRoot ? (heapType==='min' ? 'rgba(30,58,95,0.9)' : 'rgba(59,29,10,0.9)') : '#1e3a5f';
    svgCircle(svg, x, y, 22, fill, stroke, isRoot ? 3 : 2);
    svgText(svg, x, y+5, heapData[i], isRoot ? stroke : '#f0f6fc');
  }
  drawNode(0, W/2, 40, W/4);
  area.appendChild(svg);
}

// ── GRAPH ─────────────────────────────────────────────────────
function renderGraph(area) {
  const W = 460, H = 360;
  const svg = makeSVG(W, H);

  if (graphDirected) {
    const defs   = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
    marker.setAttribute('id', 'arrow'); marker.setAttribute('markerWidth', '10');
    marker.setAttribute('markerHeight', '7'); marker.setAttribute('refX', '10');
    marker.setAttribute('refY', '3.5'); marker.setAttribute('orient', 'auto');
    const poly = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    poly.setAttribute('points', '0 0,10 3.5,0 7'); poly.setAttribute('fill', '#3b82f6');
    marker.appendChild(poly); defs.appendChild(marker); svg.appendChild(defs);
  }

  const drawn = new Set();
  graphEdges.forEach(edge => {
    const key = graphDirected ? `${edge.u}-${edge.v}` : [edge.u, edge.v].sort().join('-');
    if (!graphDirected && drawn.has(key)) return;
    drawn.add(key);
    const un = graphNodes.find(n => n.id === edge.u);
    const vn = graphNodes.find(n => n.id === edge.v);
    if (!un || !vn) return;
    const line = svgLine(svg, un.x, un.y, vn.x, vn.y);
    if (graphDirected) line.setAttribute('marker-end', 'url(#arrow)');
    if (graphWeighted) {
      svgText(svg, (un.x+vn.x)/2, (un.y+vn.y)/2-6, edge.w, '#fbbf24', 11, 'JetBrains Mono,monospace', '600');
    }
  });

  graphNodes.forEach(node => {
    svgCircle(svg, node.x, node.y, 24, '#1e3a5f', '#3b82f6');
    svgText(svg, node.x, node.y+5, node.id, '#f0f6fc', 13, 'Inter,sans-serif');
  });

  if (!graphNodes.length) emptySvgText(svg, W, H, 'Add nodes and edges to visualize');
  area.appendChild(svg);
}

// ── TRIE ──────────────────────────────────────────────────────
function renderTrie(area) {
  const W = 560, H = 300;
  const svg = makeSVG(W, H);

  function drawTrieNode(node, x, y, xOff) {
    const children = Object.entries(node.children);
    children.forEach(([ch, child], i) => {
      const cx = x + (i - (children.length-1)/2) * xOff;
      const cy = y + 70;
      svgLine(svg, x, y+20, cx, cy-20);
      svgText(svg, (x+cx)/2, (y+cy)/2-4, ch, '#8b949e', 10, 'Inter,sans-serif', '600');
      drawTrieNode(child, cx, cy, xOff / Math.max(children.length, 1.5));
    });
    svgCircle(svg, x, y, 18, node.end ? 'rgba(52,211,153,0.2)' : '#1e3a5f', node.end ? '#34d399' : '#3b82f6');
    svgText(svg, x, y+5, node.c || '·', node.end ? '#34d399' : '#f0f6fc', 11);
  }

  drawTrieNode(trieRoot, W/2, 30, 160);

  const legend = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  legend.setAttribute('x', 10); legend.setAttribute('y', H-10);
  legend.setAttribute('fill', '#6e7681'); legend.setAttribute('font-size', '10');
  legend.textContent = '● Green = end of word  ● Blue = prefix node';
  svg.appendChild(legend);
  area.appendChild(svg);
}
// ── PAGE ROUTING ─────────────────────────────────────────────
function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + name).classList.add('active');
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  const map = { home: 'nav-home', linear: 'nav-linear', nonlinear: 'nav-nonlinear', about: 'nav-about' };
  if (map[name]) document.getElementById(map[name]).classList.add('active');
}

function showVisualizer(type) {
  currentViz = type;
  showPage('visualizer');
  initVizPageHTML();
  setupVisualizer(type);
  renderViz();
}

// ── SEARCH ───────────────────────────────────────────────────
function handleSearch(q) {
  if (!q) return;
  const map = {
    array: 'array', stack: 'stack', queue: 'simplequeue', linked: 'singly',
    singly: 'singly', doubly: 'doubly', circular: 'circular',
    deque: 'deque', priority: 'priorityqueue',
    tree: 'bst', bst: 'bst', binary: 'binarytree', avl: 'avl',
    heap: 'minheap', min: 'minheap', max: 'maxheap',
    graph: 'undirectedgraph', directed: 'directedgraph', weighted: 'weightedgraph',
    trie: 'trie',
  };
  const k = Object.keys(map).find(k => q.toLowerCase().startsWith(k));
  if (k) { showVisualizer(map[k]); document.getElementById('searchInput').value = ''; }
}

// ── THEME ────────────────────────────────────────────────────
function toggleDark() {
  isDark = !isDark;
  document.body.classList.toggle('light-mode', !isDark);
  document.querySelector('[onclick="toggleDark()"]').textContent = isDark ? '🌙' : '☀️';
}

// ── ANIMATION CONTROLS ────────────────────────────────────────
function togglePlay() {
  isPlaying = !isPlaying;
  document.getElementById('btnPlay').textContent = isPlaying ? '⏸ Pause' : '▶ Play';
  document.getElementById('btnPlay').classList.toggle('active', isPlaying);
  log(isPlaying ? 'Animation playing…' : 'Animation paused.');
}
function stepBack()    { log('← Previous step'); }
function stepForward() { log('→ Next step'); }
function setSpeed(val) { animSpeed = parseInt(val); }

function resetViz() {
  switch (currentViz) {
    case 'array':          arrayData         = [10,20,30,40,50];                                         break;
    case 'singly':         linkedData        = [10,20,30,40];                                            break;
    case 'doubly':         doublyData        = [10,20,30,40];                                            break;
    case 'circular':       circularData      = [10,20,30];                                               break;
    case 'stack':          stackData         = [10,20,30,40];                                            break;
    case 'simplequeue':    simpleQueueData   = [10,20,30,40];                                            break;
    case 'circularqueue':  circularQueueData = [10,20,30,40,50,60];                                      break;
    case 'priorityqueue':  priorityQueueData = [{v:20,p:1},{v:10,p:2},{v:30,p:3}];                      break;
    case 'deque':          dequeData         = [10,20,30,40];                                            break;
    case 'bst':
    case 'binarytree':
    case 'avl':            treeData = [50,30,70,20,40,60,80];                                            break;
    case 'minheap':        heapData = [10,20,30,40,50]; heapType='min'; heapify(heapData,'min');         break;
    case 'maxheap':        heapData = [60,50,40,30,20]; heapType='max'; heapify(heapData,'max');         break;
    case 'directedgraph':
    case 'undirectedgraph':
    case 'weightedgraph':
      graphNodes = [{id:'A',x:230,y:80},{id:'B',x:120,y:200},{id:'C',x:340,y:200},{id:'D',x:70,y:320},{id:'E',x:360,y:320}];
      graphEdges = [{u:'A',v:'B',w:4},{u:'A',v:'C',w:2},{u:'B',v:'D',w:5},{u:'C',v:'E',w:3},{u:'B',v:'C',w:1}];
      break;
    case 'trie':
      trieRoot = {c:'',children:{},end:false}; trieWords = ['cat','car','care'];
      trieWords.forEach(w => insertTrieWord(w, trieRoot));
      break;
  }
  log('Reset to default state.');
  renderViz();
}

// ── PAGE HTML BUILDERS ────────────────────────────────────────
function buildHomePage() {
  document.getElementById('page-home').innerHTML = `
  <div class="hero">
    <div class="hero-badge">🐍 Python-Powered Visualizations</div>
    <h1>Learn Data Structures<br>Visually</h1>
    <p>Master DSA through step-by-step animations, interactive operations, and real-time practice. Built for students who learn by doing.</p>
    <div class="hero-btns">
      <button class="btn-primary"   onclick="showPage('linear')">Explore Linear DS →</button>
      <button class="btn-secondary" onclick="showPage('nonlinear')">Explore Non-Linear DS →</button>
    </div>
  </div>
  <div class="stats-row">
    <div class="stat-pill"><span>15+</span><span>Data Structures</span></div>
    <div class="stat-pill"><span>50+</span><span>Operations</span></div>
    <div class="stat-pill"><span>8</span><span>Algorithms</span></div>
    <div class="stat-pill"><span>100%</span><span>Interactive</span></div>
    <div class="stat-pill"><span>🎨</span><span>Dark / Light Mode</span></div>
  </div>
  <div class="section-title">Explore Categories</div>
  <div class="cards-2col">
    <div class="big-card" onclick="showPage('linear')">
      <div class="card-icon">📊</div>
      <div class="card-title">Linear Data Structures</div>
      <div class="card-desc">Sequential structures where elements are arranged in a linear order. Each element has a unique predecessor and successor.</div>
      <div class="card-tags">
        <span class="tag">Array</span><span class="tag">Linked List</span>
        <span class="tag">Stack</span><span class="tag">Queue</span>
        <span class="tag">Deque</span><span class="tag">+3 more</span>
      </div>
    </div>
    <div class="big-card yellow" onclick="showPage('nonlinear')">
      <div class="card-icon">🌳</div>
      <div class="card-title">Non-Linear Data Structures</div>
      <div class="card-desc">Hierarchical and networked structures. Elements can be connected to more than one element, forming complex relationships.</div>
      <div class="card-tags">
        <span class="tag yellow">Tree</span><span class="tag yellow">Heap</span>
        <span class="tag yellow">Graph</span><span class="tag yellow">Trie</span>
        <span class="tag yellow">BST</span><span class="tag yellow">AVL</span>
      </div>
    </div>
  </div>`;
}

function buildLinearPage() {
  const cards = [
    ['array',         '📦', 'Array',               'Contiguous memory, index access',         'Access O(1) · Search O(n)'],
    ['singly',        '🔗', 'Singly Linked List',   'One-directional node chain',              'Insert O(1) · Search O(n)'],
    ['doubly',        '🔄', 'Doubly Linked List',   'Bidirectional node chain',                'Insert O(1) · Delete O(1)'],
    ['circular',      '⭕', 'Circular Linked List', 'Last node links back to head',            'Insert O(1) · Traverse O(n)'],
    ['stack',         '🗂️','Stack',                 'LIFO — Last In, First Out',               'Push O(1) · Pop O(1)'],
    ['simplequeue',   '➡️','Simple Queue',           'FIFO — First In, First Out',              'Enqueue O(1) · Dequeue O(1)'],
    ['circularqueue', '🔁', 'Circular Queue',        'Wrap-around ring buffer',                 'Enqueue O(1) · Dequeue O(1)'],
    ['priorityqueue', '⭐', 'Priority Queue',        'Elements served by priority',             'Insert O(log n) · Delete O(log n)'],
    ['deque',         '↔️','Deque',                  'Double-Ended Queue',                      'Insert/Delete O(1) both ends'],
  ];
  document.getElementById('page-linear').innerHTML = `
  <div class="breadcrumb">
    <span onclick="showPage('home')">Home</span>
    <span class="sep">/</span><span class="current">Linear Data Structures</span>
  </div>
  <div class="hero" style="padding-top:30px;padding-bottom:30px;">
    <h1 style="font-size:2rem">Linear Data Structures</h1>
    <p>Sequential storage and access. Click any structure to visualize and practice interactively.</p>
  </div>
  <div class="ds-grid">${cards.map(([id,icon,name,sub,cmp])=>`
    <div class="ds-card" onclick="showVisualizer('${id}')">
      <div class="ds-card-icon">${icon}</div>
      <div class="ds-card-name">${name}</div>
      <div class="ds-card-sub">${sub}</div>
      <div class="ds-card-complexity">${cmp}</div>
    </div>`).join('')}
  </div>`;
}

function buildNonLinearPage() {
  const cards = [
    ['binarytree',     '🌲', 'Binary Tree',       'Max 2 children per node',             'Insert O(n) · Search O(n)'],
    ['bst',            '🔍', 'Binary Search Tree','Left &lt; root &lt; right ordering',  'Insert O(log n) · Search O(log n)'],
    ['avl',            '⚖️', 'AVL Tree',           'Height-balanced BST',                 'All operations O(log n)'],
    ['minheap',        '⬇️', 'Min Heap',           'Parent always ≤ children',            'Insert O(log n) · Min O(1)'],
    ['maxheap',        '⬆️', 'Max Heap',           'Parent always ≥ children',            'Insert O(log n) · Max O(1)'],
    ['directedgraph',  '➡️', 'Directed Graph',     'Edges have direction (u → v)',        'BFS/DFS O(V+E)'],
    ['undirectedgraph','🔗', 'Undirected Graph',   'Bidirectional edges',                 'BFS/DFS O(V+E)'],
    ['weightedgraph',  '⚖️', 'Weighted Graph',     'Edges carry numeric weights',         'Dijkstra O((V+E)log V)'],
    ['trie',           '📝', 'Trie',               'Prefix tree for strings',             'Insert/Search O(m)'],
  ];
  document.getElementById('page-nonlinear').innerHTML = `
  <div class="breadcrumb">
    <span onclick="showPage('home')">Home</span>
    <span class="sep">/</span><span class="current">Non-Linear Data Structures</span>
  </div>
  <div class="hero" style="padding-top:30px;padding-bottom:30px;">
    <h1 style="font-size:2rem">Non-Linear Data Structures</h1>
    <p>Hierarchical and networked structures. Visualize trees, heaps, graphs, and tries.</p>
  </div>
  <div class="ds-grid">${cards.map(([id,icon,name,sub,cmp])=>`
    <div class="ds-card" onclick="showVisualizer('${id}')">
      <div class="ds-card-icon">${icon}</div>
      <div class="ds-card-name">${name}</div>
      <div class="ds-card-sub">${sub}</div>
      <div class="ds-card-complexity">${cmp}</div>
    </div>`).join('')}
  </div>`;
}

function buildAboutPage() {
  document.getElementById('page-about').innerHTML = `
  <div class="hero" style="padding-bottom:20px">
    <h1 style="font-size:2rem">About DSA Python Visualizer</h1>
    <p>An interactive learning platform designed to make Data Structures intuitive and enjoyable.</p>
  </div>
  <div class="about-grid">
    <div class="about-card"><h3>🎯 Purpose</h3>
      <p>This platform bridges the gap between theory and understanding. Every data structure comes with interactive animations, real operations, and Python code examples to reinforce concepts.</p>
    </div>
    <div class="about-card"><h3>📚 What You'll Learn</h3>
      <ul><li>Array &amp; Linked List operations</li><li>Stack &amp; Queue variants</li>
          <li>Trees: Binary, BST, AVL</li><li>Heap, Graph &amp; Trie structures</li>
          <li>BFS, DFS traversals</li><li>Time &amp; Space complexity</li></ul>
    </div>
    <div class="about-card"><h3>⚡ Features</h3>
      <ul><li>15+ data structures visualized</li><li>Step-by-step animations</li>
          <li>Play / Pause / Speed controls</li><li>Python code examples</li>
          <li>Dark &amp; Light mode</li><li>Fully responsive design</li></ul>
    </div>
    <div class="about-card"><h3>🛠 Tech Stack</h3>
      <ul><li>HTML5 &amp; CSS3</li><li>Vanilla JavaScript</li>
          <li>Canvas API for circular queue</li><li>SVG for trees/graphs/trie</li>
          <li>No external dependencies</li></ul>
    </div>
  </div>`;
}

// ── VISUALIZER PAGE SKELETON ──────────────────────────────────
function initVizPageHTML() {
  document.getElementById('page-visualizer').innerHTML = `
  <div class="breadcrumb" id="vizBreadcrumb"></div>
  <div class="viz-layout">
    <div class="viz-sidebar">
      <div class="sidebar-section" id="inputSection">
        <div class="sidebar-label">Input Value</div>
        <input type="text" class="sidebar-input" id="vizInput" placeholder="e.g. 42">
        <input type="text" class="sidebar-input" id="vizInput2" placeholder="Priority / Index" style="display:none">
      </div>
      <div class="sidebar-section">
        <div class="sidebar-label">Operations</div>
        <div id="opsPanel"></div>
      </div>
      <div class="sidebar-section">
        <div class="sidebar-label">Traversal / Algorithm</div>
        <div id="traversalPanel"></div>
      </div>
      <div class="sidebar-section">
        <div class="sidebar-label">Animation Controls</div>
        <div class="anim-controls">
          <button class="ctrl-btn" id="btnPlay" onclick="togglePlay()">▶ Play</button>
          <button class="ctrl-btn" onclick="stepBack()">⏮</button>
          <button class="ctrl-btn" onclick="stepForward()">⏭</button>
          <button class="ctrl-btn" onclick="resetViz()">↺ Reset</button>
          <select class="speed-select" id="speedSelect" onchange="setSpeed(this.value)">
            <option value="2000">0.5×</option>
            <option value="1000" selected>1×</option>
            <option value="500">2×</option>
            <option value="200">5×</option>
          </select>
        </div>
      </div>
      <div class="sidebar-section">
        <div class="sidebar-label">Log</div>
        <div class="message-log" id="msgLog">Ready. Enter a value and pick an operation.</div>
      </div>
    </div>
    <div class="viz-main">
      <div class="viz-header">
        <div class="viz-header-icon" id="vizHeaderIcon">📦</div>
        <div class="viz-header-info">
          <h2 id="vizHeaderTitle">–</h2>
          <p  id="vizHeaderDesc">–</p>
        </div>
      </div>
      <div class="viz-canvas" id="vizCanvas">
        <div class="canvas-label" id="canvasLabel">Visualization</div>
        <div class="canvas-area"  id="canvasArea"></div>
      </div>
      <div class="complexity-card">
        <h3>⏱ Time &amp; Space Complexity</h3>
        <table id="complexityTable"></table>
      </div>
      <div class="code-card">
        <div class="code-header">
          <div class="code-dots">
            <div class="code-dot"></div><div class="code-dot"></div><div class="code-dot"></div>
          </div>
          <span class="code-lang">python</span>
        </div>
        <pre id="codeBlock"></pre>
      </div>
    </div>
  </div>`;
}

// ── SETUP VISUALIZER ─────────────────────────────────────────
function setupVisualizer(type) {
  const cfg = configs[type];
  if (!cfg) return;

  // Breadcrumb
  const pageLabel = cfg.page === 'linear' ? 'Linear DS' : 'Non-Linear DS';
  document.getElementById('vizBreadcrumb').innerHTML =
    `<span onclick="showPage('home')">Home</span>
     <span class="sep">/</span>
     <span onclick="showPage('${cfg.page}')">${pageLabel}</span>
     <span class="sep">/</span>
     <span class="current">${cfg.title}</span>`;

  // Header
  document.getElementById('vizHeaderIcon').textContent  = cfg.icon;
  document.getElementById('vizHeaderTitle').textContent = cfg.title;
  document.getElementById('vizHeaderDesc').textContent  = cfg.desc;

  // Input2 visibility
  const inp2 = document.getElementById('vizInput2');
  inp2.style.display = type === 'priorityqueue' ? 'block' : 'none';

  // Operations
  const opsEl = document.getElementById('opsPanel');
  opsEl.innerHTML = '';
  cfg.ops.forEach(([label, fn, cls]) => {
    const b = document.createElement('button');
    b.className = 'ops-btn ' + (cls || '');
    b.textContent = label;
    b.onclick = () => handleOp(fn);
    opsEl.appendChild(b);
  });

  // Traversal
  const travEl = document.getElementById('traversalPanel');
  travEl.innerHTML = '';
  if (cfg.traversal.length) {
    cfg.traversal.forEach(([label, fn]) => {
      const b = document.createElement('button');
      b.className = 'ops-btn'; b.textContent = label;
      b.onclick = () => handleTraversal(fn);
      travEl.appendChild(b);
    });
  } else {
    travEl.innerHTML = '<span style="font-size:0.78rem;color:var(--text-muted)">No traversals for this structure</span>';
  }

  // Complexity table
  const thead = `<thead><tr><th>Operation</th><th class="o-best">Best</th><th class="o-avg">Average</th><th class="o-worst">Worst</th></tr></thead>`;
  const tbody = '<tbody>' + cfg.complexity.map(([op,b,a,w]) =>
    `<tr><td>${op}</td><td class="o-best">${b}</td><td class="o-avg">${a}</td><td class="o-worst">${w}</td></tr>`
  ).join('') + '</tbody>';
  document.getElementById('complexityTable').innerHTML = thead + tbody;

  // Code
  document.getElementById('codeBlock').innerHTML = cfg.code;
  document.getElementById('canvasLabel').textContent = cfg.title + ' — Visualization';

  // Seed data for non-linear types (only if not already seeded)
  if (['bst','binarytree','avl'].includes(type) && !treeData.length)
    treeData = [50,30,70,20,40,60,80];

  if (type === 'minheap' && !heapData.length) { heapType='min'; heapData=[10,20,30,40,50]; heapify(heapData,'min'); }
  if (type === 'maxheap' && !heapData.length) { heapType='max'; heapData=[60,50,40,30,20]; heapify(heapData,'max'); }

  if (['directedgraph','undirectedgraph','weightedgraph'].includes(type) && !graphNodes.length) {
    graphDirected = type === 'directedgraph';
    graphWeighted = type === 'weightedgraph';
    graphNodes = [{id:'A',x:230,y:80},{id:'B',x:120,y:200},{id:'C',x:340,y:200},{id:'D',x:70,y:320},{id:'E',x:360,y:320}];
    graphEdges = [{u:'A',v:'B',w:4},{u:'A',v:'C',w:2},{u:'B',v:'D',w:5},{u:'C',v:'E',w:3},{u:'B',v:'C',w:1}];
  }

  if (type === 'trie' && !trieWords.length) {
    trieWords = ['cat','car','care'];
    trieWords.forEach(w => insertTrieWord(w, trieRoot));
  }
}

// ── BOOT ─────────────────────────────────────────────────────
window.onload = () => {
  buildHomePage();
  buildLinearPage();
  buildNonLinearPage();
  buildAboutPage();
  showPage('home');
};
