// web-stores/frontend/src/pages/admin/AddProductPage.tsx
import React from 'react';
import AddProductForm from '../../components/admin/AddProductForm';

const AddProductPage: React.FC = () => {
  return (
    <div className="login-page-container">
      <div className="login-box signup-box">
        <h2>Cadastrar Novo Produto</h2>
        <AddProductForm />
      </div>
    </div>
  );
};

export default AddProductPage;