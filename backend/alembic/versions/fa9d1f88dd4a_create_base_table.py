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
        "administrator",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("username", sa.String),
        sa.Column("password", sa.String),
        sa.Column("first_name", sa.String),
        sa.Column("last_name", sa.String),
        sa.Column("email", sa.String),
        sa.Column("phone_number", sa.CHAR(10)),
    )
    
    op.create_table(
        "location",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("address", sa.String),
        sa.Column("city", sa.String),
        sa.Column("state", sa.String),
        sa.Column("zipcode", sa.Integer),
    )

    op.create_table(
        "business",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("name", sa.String),
        sa.Column("email", sa.String),
        sa.Column("phone_number", sa.CHAR(10)),
        sa.Column("username", sa.String),
        sa.Column("password", sa.String),
        sa.Column("location_id", sa.Integer, sa.ForeignKey("location.id")),
        sa.Column("status", sa.String),
    )

    op.create_table(
        "category",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("name", sa.String),
    )

    op.create_table(
        "bnf_user",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("username", sa.String),
        sa.Column("password", sa.String),
        sa.Column("first_name", sa.String),
        sa.Column("last_name", sa.String),
        sa.Column("email", sa.String),
        sa.Column("phone_number", sa.CHAR(10)),
    )

    op.create_table(
        "claim",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("status", sa.String),
        sa.Column("date", sa.DateTime),
        sa.Column("description", sa.String),
        sa.Column("business_id", sa.Integer, sa.ForeignKey("business.id")),
        sa.Column("bnf_user_id", sa.Integer, sa.ForeignKey("bnf_user.id")),
    )

    op.create_table(
        "item",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("name", sa.String),
        sa.Column("date", sa.DateTime),
        sa.Column("claim_id", sa.Integer, sa.ForeignKey("claim.id")),
        sa.Column("business_id", sa.Integer, sa.ForeignKey("business.id")),
        sa.Column("description", sa.String),
        sa.Column("image", sa.String),
    )

    op.create_table(
        "log",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("date", sa.DateTime),
        sa.Column("description", sa.String),
        sa.Column("claim_id", sa.Integer, sa.ForeignKey("claim.id")),
    )

    op.create_table(
        "contain",
        sa.Column("category_id", sa.Integer, sa.ForeignKey("category.id")),
        sa.Column("item_id", sa.Integer, sa.ForeignKey("item.id")),
    )

    op.create_table(
        "manage",
        sa.Column("admin_id", sa.Integer, sa.ForeignKey("administrator.id")),
        sa.Column("claim_id", sa.Integer, sa.ForeignKey("claim.id")),
        sa.Column("business_id", sa.Integer, sa.ForeignKey("business.id")),
    )


def downgrade() -> None:
    op.drop_table("manage")
    op.drop_table("contain")
    op.drop_table("log")
    op.drop_table("item")
    op.drop_table("claim")
    op.drop_table("business")
    op.drop_table("category")
    op.drop_table("administrator")
    op.drop_table("bnf_user")
    op.drop_table("location")


