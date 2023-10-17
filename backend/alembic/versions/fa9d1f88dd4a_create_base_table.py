"""create base table

Revision ID: fa9d1f88dd4a
Revises: 
Create Date: 2023-10-17 17:03:47.682911

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'fa9d1f88dd4a'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "base_table",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("text", sa.String),
        sa.Column("boolean", sa.Boolean)
    )


def downgrade() -> None:
    op.drop_table("base_table")
