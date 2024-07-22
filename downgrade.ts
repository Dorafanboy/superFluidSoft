﻿export const downgradeABI = [{"inputs":[{"internalType":"contract IWETH","name":"weth","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"TokenDowngraded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"TokenUpgraded","type":"event"},{"stateMutability":"payable","type":"fallback"},{"inputs":[{"internalType":"uint256","name":"wad","type":"uint256"}],"name":"downgrade","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"wad","type":"uint256"}],"name":"downgradeToETH","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getUnderlyingToken","outputs":[{"internalType":"address","name":"tokenAddr","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"initialAddress","type":"address"}],"name":"initializeProxy","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"wad","type":"uint256"}],"name":"upgrade","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"upgradeByETH","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"}],"name":"upgradeByETHTo","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"wad","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"upgradeTo","outputs":[],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}]