"""drop_unused_tables_flashcards_resumes

Revision ID: ad49bf96c802
Revises: 8cb3657c73a8
Create Date: 2025-09-21 19:05:41.014650

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'ad49bf96c802'
down_revision = '8cb3657c73a8'
branch_labels = None
depends_on = None


def upgrade():
    # Drop the unused tables
    op.drop_table('flashcards')
    op.drop_table('flashcard_sets')
    op.drop_table('resumes')


def downgrade():
    # Recreate the tables if needed to rollback
    # Note: This is a simplified recreation - you may need to adjust based on your original schema
    op.create_table('resumes',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=True),
        sa.Column('title', sa.String(length=255), nullable=True),
        sa.Column('full_content', sa.Text(), nullable=True),
        sa.Column('generated_bullet_points', sa.JSON(), nullable=True),
        sa.Column('critique', sa.Text(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_resumes_user_id'), 'resumes', ['user_id'], unique=False)
    
    op.create_table('flashcard_sets',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=True),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('source_info', sa.Text(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_flashcard_sets_user_id'), 'flashcard_sets', ['user_id'], unique=False)
    
    op.create_table('flashcards',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('set_id', sa.Integer(), nullable=False),
        sa.Column('question', sa.Text(), nullable=False),
        sa.Column('answer', sa.Text(), nullable=False),
        sa.ForeignKeyConstraint(['set_id'], ['flashcard_sets.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_flashcards_set_id'), 'flashcards', ['set_id'], unique=False)
