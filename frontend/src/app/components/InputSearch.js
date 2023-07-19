import React, { useState } from "react";
import { Form, FormControl, Button, InputGroup } from "react-bootstrap";

const InputSearch = (props) => {
  const [filter, setFilter] = useState({});

  const onChangeValue = (target) => {
    let obj = {};
    obj.search = target.value;
    setFilter(obj);
  };

  const submitSearch = (e) => {
    e.preventDefault();
    props.onSearch(filter);
  };

  return (
    <Form onSubmit={submitSearch}>
      <InputGroup className="mb-3">
        <FormControl
          placeholder={`Cari ${props.placeholder ? props.placeholder : ""}`}
          aria-label="Pencarian"
          aria-describedby="basic-addon2"
          onChange={(e) => {
            onChangeValue(e.target);
          }}
        />
        <InputGroup.Append>
          <Button onClick={submitSearch} variant="outline-secondary">
            <i className="fa fa-search"></i>
          </Button>
        </InputGroup.Append>
      </InputGroup>
    </Form>
  );
};

export default InputSearch;
