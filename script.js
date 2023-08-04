const estimateItems = [
  { name: '選択してください', companies: [], amounts: [] },
  { name: '土木工事', companies: ['選択してください', '建設会社A', '建設会社B'], amounts: [null, 100000, 150000] },
  { name: '電気工事', companies: ['選択してください', '電気工事会社X', '電気工事会社Y'], amounts: [null, 80000, 120000] },
  { name: '塗装工事', companies: ['選択してください', '塗装会社M', '塗装会社N'], amounts: [null, 60000, 90000] },
];

const formContainer = document.getElementById('formContainer');
const addButton = document.getElementById('addButton');

addButton.addEventListener('click', () => {
  addRow();
});

function addRow() {
  const row = document.createElement('div');
  row.classList.add('row');

  const itemLabel = document.createElement('label');
  itemLabel.textContent = '見積項目:';
  const itemSelect = createSelect(estimateItems.map(item => item.name), 'item');

  const companyLabel = document.createElement('label');
  companyLabel.textContent = '担当会社:';
  const companySelect = createSelect([], 'company');

  const amountLabel = document.createElement('label');
  amountLabel.textContent = '金額:';
  const amountLabelValue = document.createElement('label');
  amountLabelValue.classList.add('amount');
  amountLabelValue.textContent = '';

  const deleteButton = document.createElement('button');
  deleteButton.textContent = '削除';
  deleteButton.addEventListener('click', () => {
    formContainer.removeChild(row);
  });

  itemSelect.addEventListener('change', () => {
    const selectedEstimateItem = estimateItems.find(item => item.name === itemSelect.value);
    updateCompanyOptions(companySelect, selectedEstimateItem.companies);
    amountLabelValue.textContent = '';
  });

  companySelect.addEventListener('change', () => {
    const selectedEstimateItem = estimateItems.find(item => item.name === itemSelect.value);
    const selectedCompanyIndex = companySelect.selectedIndex;
    if (selectedCompanyIndex >= 0 && selectedCompanyIndex < selectedEstimateItem.amounts.length) {
      const amount = selectedEstimateItem.amounts[selectedCompanyIndex];
      amountLabelValue.textContent = amount !== null ? amount.toString() : '';
    } else {
      amountLabelValue.textContent = '';
    }
  });

  row.appendChild(itemLabel);
  row.appendChild(itemSelect);
  row.appendChild(companyLabel);
  row.appendChild(companySelect);
  row.appendChild(amountLabel);
  row.appendChild(amountLabelValue);
  row.appendChild(deleteButton);

  formContainer.appendChild(row);

  const selectedEstimateItem = estimateItems.find(item => item.name === itemSelect.value);
  updateCompanyOptions(companySelect, selectedEstimateItem.companies);
  amountLabelValue.textContent = '';
}

function createSelect(options, name) {
  const select = document.createElement('select');
  select.name = name;
  options.forEach((option) => {
    const optionElement = document.createElement('option');
    optionElement.textContent = option;
    select.appendChild(optionElement);
  });
  return select;
}

function updateCompanyOptions(companySelect, companies) {
  companySelect.innerHTML = '';
  companies.forEach((company) => {
    const optionElement = document.createElement('option');
    optionElement.textContent = company;
    companySelect.appendChild(optionElement);
  });
}

addRow();

const submitButton = document.getElementById('submitButton');
submitButton.addEventListener('click', () => {
  const rows = document.querySelectorAll('.row');
  const summary = {};

  rows.forEach(row => {
    const itemSelect = row.querySelector('select[name="item"]');
    const companySelect = row.querySelector('select[name="company"]');
    const amountLabel = row.querySelector('.amount');

    const selectedItemText = itemSelect.options[itemSelect.selectedIndex].text;
    const selectedCompany = companySelect.value;
    const selectedAmount = parseInt(amountLabel.textContent) || 0;

    if (selectedItemText !== '選択してください' && selectedCompany !== '選択してください') {
      if (!summary[selectedCompany]) {
        summary[selectedCompany] = 0;
      }
      summary[selectedCompany] += selectedAmount;
    }
  });

  const summaryText = Object.entries(summary).map(([company, amount]) => `${company}: ${amount}円`).join('\n');
  alert(`担当会社ごとの合計金額\n\n${summaryText}`);
});
