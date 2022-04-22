import React, { Component, useEffect, useState } from 'react';
import { ethers } from 'ethers';

import { contractABI, contractAddress } from '../utils/constants';

export const TransactionContext = React.createContext();

const { ethereum } = window;

const getEthereumContract = () => {
	const provider = new ethers.providers.Web3Provider(ethereum);
	const signer = provider.getSigner();
	const transactionContract = new ethers.Contract(
		contractAddress,
		contractABI,
		signer
	);
	return transactionContract;
};

export const TransactionProvider = ({ children }) => {
	const [currentAccount, setCurrentAccount] = useState('');
	const [formData, setFormData] = useState({
		addressTo: '',
		amount: '',
		keyword: '',
		message: '',
	});
	const [isLoading, setIsLoading] = useState(false);
	const [transactionCount, setTransactionCount] = useState(
		localStorage.getItem('transactionCount')
	);

	const handleChange = (e, name) => {
		setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
	};

	const checkIfWalletIsConnected = async () => {
		try {
			if (!ethereum) return alert('Please install metamask');
			const accounts = await ethereum.request({ method: 'eth_accounts' });
			if (accounts.length) {
				setCurrentAccount(accounts[0]);
			} else {
				console.log('No accounts found');
			}
		} catch (error) {
			console.log(error);
			throw new Error('No ethereum object');
		}
	};

	const connectWallet = async () => {
		try {
			if (!ethereum) return alert('Please install metamask');
			const accounts = await ethereum.request({
				method: 'eth_requestAccounts',
			});

			setCurrentAccount(accounts[0]);
			console.log('Wallet is connected');
			console.log(accounts);
		} catch (error) {
			console.log(error);
			throw new Error('No ethereum object');
		}
	};

	const sendTransaction = async (formData) => {
		try {
			if (!ethereum) return alert('Please install metamask');
			const { addressTo, amount, keyword, message } = formData;
			const transactionContract = getEthereumContract();
			//Parse decimal amount into a hexidecimal amount to send over network
			const parsedAmount = ethers.utils.parseEther(amount);
			// const estimateFees = transactionContract.estimateGas.transfer(addressTo, amount)
			// console.log('Fees: ', estimateFees)
			await ethereum.request({
				method: 'eth_sendTransaction',
				params: [
					{
						from: currentAccount,
						to: addressTo,
						//send 2100 gwei - 0.000021 eth as gas fees
						//normally this would be variable
						gas: '0x5208',
						value: parsedAmount._hex,
					},
				],
			});

			//Add our transaction to the blockchain
			console.log(Object.keys(transactionContract));
            console.log(transactionContract)
			const transactionHash = await transactionContract.addToBlockchain(
				addressTo,
				parsedAmount,
				message,
				keyword
			);
			//
            console.log("afterTrans")
			setIsLoading(true);
			console.log(`Loading - ${transactionHash.hash}`);
			await transactionHash.wait();
			setIsLoading(false);
			console.log(`Success - ${transactionHash.hash}`);

			const transactionCount = await transactionContract.getTransactionCount();
			setTransactionCount(transactionCount.toNumber());
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		checkIfWalletIsConnected();
	}, []);
	return (
		<TransactionContext.Provider
			value={{
				sendTransaction,
				connectWallet,
				currentAccount,
				formData,
				setFormData,
				handleChange,
			}}
		>
			{children}
		</TransactionContext.Provider>
	);
};
