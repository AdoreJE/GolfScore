/*
SPDX-License-Identifier: Apache-2.0
*/

package main

import (
	"encoding/json"
	"fmt"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// SmartContract provides functions for managing a reservation
type SmartContract struct {
	contractapi.Contract
}

// User is the struct that describes user's information
type User struct {
	UserID   string `json:"userID"`
	UserPWD  string `json:"userPWD"`
	UserName string `json:"userName"`
}

// InitLedger is the init function
func (s *SmartContract) InitLedger(ctx contractapi.TransactionContextInterface) error {
	fmt.Println("initLedger")
	return nil
}

// SignUp is the invoke function that create new User
// params - userID, userPassword, and user Name
func (s *SmartContract) SignUp(ctx contractapi.TransactionContextInterface, userID, userPWD, userName string) error {
	fmt.Println("Sign Up")
	// create the composite key for the User
	userCompositeKey, _ := ctx.GetStub().CreateCompositeKey("userID", []string{userID})

	userAsBytes, err := ctx.GetStub().GetState(userCompositeKey)
	if err != nil {
		return fmt.Errorf("Failed to read from world state. %s", err.Error())
	}

	if userAsBytes != nil {
		return fmt.Errorf("%s already exist", userID)
	}

	// update User
	user := User{
		UserID:   userID,
		UserPWD:  userPWD,
		UserName: userName,
	}
	userAsBytes, _ = json.Marshal(user)
	return ctx.GetStub().PutState(userCompositeKey, userAsBytes)
}

// QueryUser is the query function that returns the User with given userID
// params - userID
// returns the User
func (s *SmartContract) QueryUser(ctx contractapi.TransactionContextInterface, userID string) (*User, error) {
	fmt.Println("Query user")

	// create composite key for the user
	userCompositeKey, _ := ctx.GetStub().CreateCompositeKey("userID", []string{userID})
	userAsBytes, err := ctx.GetStub().GetState(userCompositeKey)
	if err != nil {
		return nil, fmt.Errorf("Failed to read from world state. %s", err.Error())
	}

	if userAsBytes == nil {
		return nil, fmt.Errorf("%s does not exist", userID)
	}

	user := new(User)
	_ = json.Unmarshal(userAsBytes, user)

	return user, nil
}

// DeleteUser deletes an given user from the world state.
// params - userID
func (s *SmartContract) DeleteUser(ctx contractapi.TransactionContextInterface, userID string) error {
	fmt.Println("Delete user")
	userCompositeKey, _ := ctx.GetStub().CreateCompositeKey("userID", []string{userID})

	userAsBytes, err := ctx.GetStub().GetState(userCompositeKey)
	if err != nil {
		return fmt.Errorf("Failed to read from world state. %s", err.Error())
	}

	if userAsBytes == nil {
		return fmt.Errorf("the user %s does not exist", userID)
	}

	return ctx.GetStub().DelState(userCompositeKey)
}

// QueryAllUser returns all users found in world state
// returns the array of User
func (s *SmartContract) QueryAllUser(ctx contractapi.TransactionContextInterface) ([]*User, error) {
	// get the Iterator
	resultsIterator, err := ctx.GetStub().GetStateByPartialCompositeKey("userID", []string{})

	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	var users []*User

	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()

		if err != nil {
			return nil, err
		}

		var user User

		_ = json.Unmarshal(queryResponse.Value, &user)

		users = append(users, &user)
	}

	return users, nil
}

// main function
func main() {

	chaincode, err := contractapi.NewChaincode(new(SmartContract))

	if err != nil {
		fmt.Printf("Error create fabcar chaincode: %s", err.Error())
		return
	}

	if err := chaincode.Start(); err != nil {
		fmt.Printf("Error starting fabcar chaincode: %s", err.Error())
	}
}
