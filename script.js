document.addEventListener('DOMContentLoaded', function() {
    const chooseCPU1 = document.getElementById('chooseCPU1');
    const chooseCPU2 = document.getElementById('chooseCPU2');
    const chooseCPU3 = document.getElementById('chooseCPU3');

    // サイト作者はAMD派なので.
    chooseCPU1.addEventListener('change', function() {
        if (chooseCPU1.checked) {
            alert('サイト作者の極めて偏った思想により、Intel製CPUを選択することはできません。');
            chooseCPU3.checked = true;
        }
    });

    // 全部リストアップするの単純にめんどかった.
    chooseCPU2.addEventListener('change', function() {
        if (chooseCPU2.checked) {
            alert('サイト作者がAMD製のCPUを全てリストアップすることを面倒くさがったため、CPUはRyzen 9000 Seriesしか選択できません。');
            chooseCPU3.checked = true;
        }
    });

    const chooseGPU1 = document.getElementById('chooseGPU1');
    const chooseGPU2 = document.getElementById('chooseGPU2');
    const chooseGPU3 = document.getElementById('chooseGPU3');

    // 全部リストアップするの（ｒｙ.
    chooseGPU2.addEventListener('change', function() {
        if (chooseGPU2.checked) {
            alert('サイト作者がNVIDIA GeForce Seriesの全てのGPUをリストアップすることを面倒くさがったため、GPUはRTX 4000 Seriesしか選択できません。');
            chooseGPU1.checked = true;
        }
    });

    // サイト作成者はNVIDIA派なので.
    chooseGPU3.addEventListener('change', function() {
        if (chooseGPU3.checked) {
            alert('サイト作者の極めて偏った思想により、AMD Radeon Seriesを選択することはできません。');
            chooseGPU1.checked = true;
        }
    });

    // 覚悟を決めたら実行.
    const decision = document.getElementById('decision');
    decision.addEventListener('click', async function() {
        const budget = parseInt(document.querySelector('input[name="btnGroupBudget"]:checked').nextElementSibling.textContent.trim()) * 10000;
        const osName = document.querySelector('input[name="chooseOS"]:checked').nextElementSibling.textContent.trim();
        const ram = document.querySelector('.form-select').value;

        // 選べや（ただしRAM容量は計算には一切影響しない）.
        if (ram === 'Choose one') {
            alert('RAM容量を選択してください。');
            return;
        }

        // キミ、64KiBがいいんだね！それならこれしかないよね！！.
        if (ram === '64KiB') {
            const resultDiv = document.getElementById('result');
            resultDiv.innerHTML = `
                <div class="mb-5">
                    <h2 class="h4">最高の体験を。</h2>
                    <p class="h1 fw-bold">- Commodore 64</p>
                    <img src="assets/img/Commodore-64.png" alt="Commodore 64" style="max-width: 100%; height: auto;">
                    <p class="text-muted" style="font-size: small;">出典: <a href="https://commons.wikimedia.org/wiki/File:Commodore-64-Computer-FL.png" target="_blank">Wikimedia Commons</a></p>
                </div>
            `;
            return;
        }

        const cpuData = await fetch('assets/data/cpu.json').then(response => response.json());
        const gpuData = await fetch('assets/data/gpu.json').then(response => response.json());
        const osData = await fetch('assets/data/os.json').then(response => response.json());

        const selectedOS = osData[osName];
        let selectedCPU = null;
        let selectedGPU = null;

        // 脳筋計算その1.
        for (const details of Object.values(cpuData)) {
            if (details.cost <= budget && (!selectedCPU || details.performance > selectedCPU.performance)) {
                selectedCPU = details;
            }
        }

        // 脳筋計算その2.
        for (const details of Object.values(gpuData)) {
            if (details.cost <= budget && (!selectedGPU || details.performance > selectedGPU.performance)) {
                selectedGPU = details;
            }
        }

        // 脳筋計算その3（予算オーバーの場合の調整処理・雑オブ雑）.
        while (selectedCPU.cost + selectedGPU.cost + selectedOS.cost > budget) {
            let newSelectedGPU = null;
            for (const details of Object.values(gpuData)) {
                if (details.cost < selectedGPU.cost && (!newSelectedGPU || details.performance > newSelectedGPU.performance)) {
                    newSelectedGPU = details;
                }
            }
            if (newSelectedGPU) {
                selectedGPU = newSelectedGPU;
            } else {
                let newSelectedCPU = null;
                for (const details of Object.values(cpuData)) {
                    if (details.cost < selectedCPU.cost && (!newSelectedCPU || details.performance > newSelectedCPU.performance)) {
                        newSelectedCPU = details;
                    }
                }
                if (newSelectedCPU) {
                    selectedCPU = newSelectedCPU;
                } else {
                    break;
                }
            }
        }

        // 余剰金の計算. ただし結局考慮しているのはCPUとGPUだけなので全くアテにならない.
        const remainingBudget = budget - (selectedCPU.cost + selectedGPU.cost + selectedOS.cost);

        // 金額が見づらかったのでカンマ区切りにする.
        const formatPrice = (price) => price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

        // 結果表示（ゴリ押し）.
        const resultDiv = document.getElementById('result');
        resultDiv.innerHTML = `
            <h2 class="h2 mb-2">あなたにおすすめのパーツリスト</h2>
            <table class="table table-striped mb-5">
            <thead>
                <tr>
                <th scope="col">#</th>
                <th scope="col">項目</th>
                <th scope="col">おすすめ</th>
                <th scope="col">価格</th>
                <th scope="col">購入リンク</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                <th scope="row">1</th>
                <td colspan="2">総予算</td>
                <td colspan="2">¥${formatPrice(budget)}</td>
                </tr>
                <tr>
                <th scope="row">2</th>
                <td>OS</td>
                <td>${selectedOS.name}</td>
                <td>¥${formatPrice(selectedOS.cost)}</td>
                <td><a href="${selectedOS.dl_url}" class="btn btn-primary" target="_blank">ダウンロード</a></td>
                </tr>
                <tr>
                <th scope="row">3</th>
                <td>CPU</td>
                <td>${selectedCPU.name}</td>
                <td>¥${formatPrice(selectedCPU.cost)}</td>
                <td><a href="${selectedCPU.buy_url}" class="btn btn-primary" target="_blank">購入(Amazon)</a></td>
                </tr>
                <tr>
                <th scope="row">4</th>
                <td>GPU</td>
                <td>${selectedGPU.name}</td>
                <td>¥${formatPrice(selectedGPU.cost)}</td>
                <td><button type="button" class="btn btn-primary" disabled>購入</button></td>
                </tr>
                <tr>
                <th scope="row">5</th>
                <td>RAM容量</td>
                <td>${ram}</td>
                <td>price</td>
                <td><button type="button" class="btn btn-primary" disabled>購入</button></td>
                </tr>
                <tr>
                <th scope="row">6</th>
                <td colspan="2">余剰金</td>
                <td colspan="2">¥${formatPrice(remainingBudget)}</td>
                </tr>
            </tbody>
            </table>
            <p class="text-muted" style="font-size: small;">※各パーツ等の価格は参考価格であり、実際の金額と異なります。</p>
        `;
    });
});
