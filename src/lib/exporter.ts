export function generateMandalartHtml(grid: string[][]): string {
    // Grid is 9 blocks (0-8), each 9 cells.
    // We want to render this as a seamless 9x9 table/grid.

    // Flattening for easiest rendering:
    // Visual layout:
    // Row 1: Block 0 (Row 0), Block 1 (Row 0), Block 2 (Row 0)
    // ...

    // Let's create a structure that is easy to iterate in HTML.
    // We can just dump the `grid` variable into the JS of the generated HTML and render it.

    const serializedGrid = JSON.stringify(grid);

    return `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Mandalart</title>
    <style>
        :root {
            --bg-color: #0f172a;
            --text-color: #f8fafc;
            --primary-color: #f8fafc;
            --secondary-color: #1e293b;
            --accent-color: #334155;
            --border-color: #334155;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            background-color: var(--bg-color);
            color: var(--text-color);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            padding: 20px;
        }
        h1 {
            margin-bottom: 20px;
            color: var(--primary-color);
            font-weight: 700;
        }
        .container {
            width: 100%;
            max-width: 800px;
            aspect-ratio: 1;
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 8px;
            background-color: var(--border-color);
            padding: 8px;
            border-radius: 12px;
        }
        .block {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 2px;
            background-color: var(--bg-color);
        }
        .cell {
            background-color: var(--secondary-color);
            color: var(--text-color);
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            font-size: 10px;
            padding: 4px;
            word-wrap: break-word;
            word-break: break-word;
            overflow: hidden;
            white-space: pre-wrap;
            line-height: 1.2;
        }
        @media (min-width: 600px) {
            .cell { font-size: 12px; padding: 6px; }
        }
        
        /* Center Block Styles */
        .block:nth-child(5) {
            background-color: rgba(255, 255, 255, 0.05);
        }
        .block:nth-child(5) .cell {
            background-color: #1e293b;
            font-weight: 600;
        }
        
        /* Core Goal (Center of Center) */
        .block:nth-child(5) .cell:nth-child(5) {
            background-color: var(--primary-color);
            color: var(--bg-color);
            font-weight: 800;
            font-size: 1.2em;
        }

        /* Key Areas (Centers of Outer Blocks) */
        .block:not(:nth-child(5)) .cell:nth-child(5) {
            background-color: #334155;
            font-weight: 700;
        }

        /* Hover Effects */
        .cell:hover {
            opacity: 0.8;
            transform: scale(1.05);
            z-index: 10;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        
        /* Detail View (Hidden by default) */
        #detail-view {
            width: 100%;
            max-width: 600px;
            margin-top: 20px;
            padding: 24px;
            background-color: var(--secondary-color);
            border-radius: 12px;
            border: 1px solid var(--border-color);
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.3s ease;
            pointer-events: none;
            display: none; /* Initially hidden layout-wise too? No, keep layout stable or not? display none is safer */
            display: block; /* We use opacity for transition, but maybe display for flow */
        }
        #detail-view.visible {
            opacity: 1;
            transform: translateY(0);
            pointer-events: auto;
        }
        #detail-title {
            color: var(--primary-color);
            margin-top: 0;
            margin-bottom: 16px;
            font-size: 1.5em;
            text-align: center;
        }
        #detail-list {
            list-style: none;
            padding: 0;
            margin: 0;
            display: grid;
            grid-template-columns: 1fr;
            gap: 8px;
        }
        #detail-list li {
            padding: 8px 12px;
            background-color: rgba(255,255,255,0.05);
            border-radius: 6px;
            font-size: 14px;
        }

        /* Interactive States */
        .block.dimmed {
            opacity: 0.1;
            filter: blur(2px);
            pointer-events: none;
            transition: all 0.3s ease;
        }
        .block.active {
            opacity: 1;
            filter: none;
            pointer-events: auto;
            box-shadow: 0 0 0 2px var(--primary-color);
            transform: scale(1.02);
            z-index: 20;
        }
        
        /* Center Block Always Interactive */
        .block:nth-child(5) {
            opacity: 1 !important;
            filter: none !important;
            pointer-events: auto !important;
            background-color: rgba(255, 255, 255, 0.05);
        }

        /* Instruction Overlay */
        .instruction {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            color: var(--text-color);
            background: rgba(0,0,0,0.8);
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            pointer-events: none;
            opacity: 0.7;
        }
    </style>
</head>
<body>
    <div class="instruction">중앙의 핵심 영역을 클릭하면 세부 목표가 아래에 표시됩니다.</div>
    <div id="app" class="container"></div>
    <div id="detail-view">
        <h3 id="detail-title"></h3>
        <ul id="detail-list"></ul>
    </div>

    <script>
        const gridData = ${serializedGrid};
        const app = document.getElementById('app');
        const detailTitle = document.getElementById('detail-title');
        const detailList = document.getElementById('detail-list');
        const detailView = document.getElementById('detail-view');

        // Render Grid
        gridData.forEach((block, blockIndex) => {
            const blockDiv = document.createElement('div');
            blockDiv.className = 'block';
            blockDiv.id = 'block-' + blockIndex;
            
            // Default State: Dim outer blocks
            if (blockIndex !== 4) {
               blockDiv.classList.add('dimmed');
            }
            
            block.forEach((cellValue, cellIndex) => {
                const cellDiv = document.createElement('div');
                cellDiv.className = 'cell';
                cellDiv.textContent = cellValue;
                
                // --- Interaction Logic ---
                
                // 1. Center Block Interaction
                if (blockIndex === 4) {
                    if (cellIndex === 4) {
                        // "Center of Center" -> Reset
                        cellDiv.style.cursor = 'pointer';
                        cellDiv.title = "전체 보기";
                        cellDiv.onclick = (e) => {
                            e.stopPropagation();
                            resetView();
                        };
                    } else {
                        // "Key Area" -> Reveal Outer Block & Show Detail List
                        cellDiv.style.cursor = 'pointer';
                        cellDiv.title = "세부 목표 보기";
                        cellDiv.onclick = (e) => {
                            e.stopPropagation();
                            focusBlock(cellIndex); // cellIndex in Center == BlockIndex of Outer
                            showDetail(cellIndex);
                        };
                    }
                }
                
                // 2. Outer Block Interaction
                // Clicking the center of an outer block also focuses it and shows details
                if (blockIndex !== 4) {
                    if (cellIndex === 4) {
                         cellDiv.style.cursor = 'pointer';
                         cellDiv.onclick = (e) => {
                            e.stopPropagation();
                            focusBlock(blockIndex);
                            showDetail(blockIndex);
                         };
                    }
                }
                
                blockDiv.appendChild(cellDiv);
            });
            
            app.appendChild(blockDiv);
        });

        function focusBlock(targetIndex) {
            const blocks = document.querySelectorAll('.block');
            blocks.forEach((b, idx) => {
                if (idx === 4) return; // Center always visible
                
                if (idx === targetIndex) {
                    b.classList.remove('dimmed');
                    b.classList.add('active');
                } else {
                    b.classList.add('dimmed');
                    b.classList.remove('active');
                }
            });
        }

        function showDetail(blockIndex) {
            // Get data from the gridData[blockIndex]
            // In a standard 9x9 block:
            // Center (cell 4) is the Title.
            // Surrounding (0,1,2,3,5,6,7,8) are the items.
            
            const block = gridData[blockIndex];
            const title = block[4];
            const items = [0,1,2,3,5,6,7,8].map(i => block[i]).filter(t => t && t.trim() !== "");
            
            detailView.classList.add('visible');
            detailTitle.textContent = title;
            detailList.innerHTML = items.map(item => \`<li>\${item}</li>\`).join('');
            
            // Scroll to detail view on mobile
            if (window.innerWidth < 600) {
                detailView.scrollIntoView({ behavior: 'smooth' });
            }
        }

        function resetView() {
             const blocks = document.querySelectorAll('.block');
             blocks.forEach((b, idx) => {
                if (idx === 4) return;
                b.classList.remove('dimmed');
                b.classList.remove('active');
             });
             
             // Hide Detail View
             detailView.classList.remove('visible');
        }
        
        // Initial Click on background to reset
        document.body.onclick = (e) => {
            if (e.target.tagName === 'BODY' || e.target.tagName === 'H1') {
                resetView();
            }
        };
    </script>
</body>
</html>`;
}
