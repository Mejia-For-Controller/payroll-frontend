package main

import (
    "fmt"
)

import (
	"io/ioutil"
)

import (
	"sort"
)

import (
    "time"
)

import "os"

import "encoding/json"

type Employee struct {
	id int
	first string
	last string
	dept string
	jobtitle string
	base float64
	overtime float64 
	other float64 
	healthcare float64 
	retirement float64 
  }



func main() {
    start := time.Now()

  //  time.Sleep(time.Second * 2)

  jsonFile, err := os.Open("employees8.json")
  if err != nil {
    fmt.Println(err)
}



// read our opened jsonFile as a byte array.
byteValue, _ := ioutil.ReadAll(jsonFile)
s := []byte(byteValue)

  //var Employees []Employee
//var Employees []Employee
 Employees = json.NewDecoder(s)
  
  fmt.Printf("Employees : %+vs", Employees)

    //something doing here

    elapsed := time.Since(start)
    fmt.Printf("page took    %s\n", elapsed)

	startsort := time.Now()	

	 sort.Slice(Employees, func(i, j int) bool {
		return Employees[i].base > Employees[j].base
	  })

	 endsort:= time.Since(startsort)
	  fmt.Printf("BaseSort took    %s\n", endsort)

	  startsort2 := time.Now()	

	 sort.Slice(Employees, func(i, j int) bool {
		return Employees[i].last > Employees[j].last
	  })


	 endsort2:= time.Since(startsort2)
	  fmt.Printf("Last Name Sort took    %s\n", endsort2)
}