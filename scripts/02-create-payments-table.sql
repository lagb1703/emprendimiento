-- Create payments table to store transaction information
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  chat_id UUID REFERENCES chats(id) ON DELETE SET NULL,
  plan_name VARCHAR(255) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'COP',
  status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, completed, failed, refunded
  payment_method VARCHAR(50) NOT NULL, -- card, pse, transfer
  transaction_id VARCHAR(255) UNIQUE,
  wompy_reference VARCHAR(255),
  payer_name VARCHAR(255) NOT NULL,
  payer_email VARCHAR(255) NOT NULL,
  payer_phone VARCHAR(20),
  payer_document_type VARCHAR(50),
  payer_document_number VARCHAR(50),
  payer_address VARCHAR(255),
  payer_city VARCHAR(100),
  payer_postal_code VARCHAR(20),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT valid_status CHECK (status IN ('pending', 'completed', 'failed', 'refunded'))
);

CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_created_at ON payments(created_at);
