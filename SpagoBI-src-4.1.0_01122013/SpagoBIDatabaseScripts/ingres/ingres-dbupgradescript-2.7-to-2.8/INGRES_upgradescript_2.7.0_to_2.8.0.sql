alter table sbi_org_unit alter column NAME varchar(200)
;\p\g
CREATE SEQUENCE SBI_GOAL_SEQ
;\p\g
CREATE TABLE SBI_GOAL (
  GOAL_ID       INTEGER NOT NULL with default next value for SBI_GOAL_SEQ,
  GRANT_ID      INTEGER NOT NULL,
  START_DATE    DATE NOT NULL,
  END_DATE      DATE NOT NULL,
  NAME          VARCHAR(20) NOT NULL,
  LABEL          VARCHAR(20) NOT NULL,
  DESCRIPTION		VARCHAR(1000),
  PRIMARY KEY (GOAL_ID)
);\p\g

CREATE SEQUENCE SBI_GOAL_HIERARCHY_SEQ
;\p\g
CREATE TABLE SBI_GOAL_HIERARCHY (
  GOAL_HIERARCHY_ID INTEGER NOT NULL with default next value for SBI_GOAL_HIERARCHY_SEQ,
  ORG_UNIT_ID       INTEGER NOT NULL,
  GOAL_ID           INTEGER NOT NULL,
  PARENT_ID         INTEGER,
  NAME              VARCHAR(50) NOT NULL,
  LABEL             VARCHAR(50),
  GOAL              VARCHAR(1000),
  PRIMARY KEY (GOAL_HIERARCHY_ID)
);\p\g

CREATE SEQUENCE SBI_GOAL_KPI_SEQ
;\p\g
CREATE TABLE SBI_GOAL_KPI (
  GOAL_KPI_ID         INTEGER NOT NULL with default next value for SBI_GOAL_KPI_SEQ,
  KPI_INSTANCE_ID     INTEGER NOT NULL,
  GOAL_HIERARCHY_ID   INTEGER NOT NULL,
  WEIGHT1             Float,
  WEIGHT2             Float,
  THRESHOLD1          Float,
  THRESHOLD2          Float,
  THRESHOLD1SIGN      INTEGER,
  THRESHOLD2SIGN      INTEGER,
  PRIMARY KEY (GOAL_KPI_ID)
);\p\g

ALTER TABLE SBI_GOAL ADD CONSTRAINT FK_GRANT_ID_GRANT FOREIGN KEY ( GRANT_ID ) REFERENCES SBI_ORG_UNIT_HIERARCHIES ( ID ) ON DELETE CASCADE;\p\g    
ALTER TABLE SBI_GOAL_HIERARCHY ADD CONSTRAINT FK_SBI_GOAL_HIERARCHY_GOAL  FOREIGN KEY (GOAL_ID) REFERENCES SBI_GOAL (GOAL_ID) ON DELETE CASCADE;\p\g
ALTER TABLE SBI_GOAL_HIERARCHY ADD CONSTRAINT FK_SBI_GOAL_HIERARCHY_PARENT  FOREIGN KEY (PARENT_ID) REFERENCES SBI_GOAL_HIERARCHY (GOAL_HIERARCHY_ID) ON DELETE CASCADE;\p\g
ALTER TABLE SBI_GOAL_KPI ADD CONSTRAINT FK_SBI_GOAL_KPI_GOAL  FOREIGN KEY (GOAL_HIERARCHY_ID) REFERENCES SBI_GOAL_HIERARCHY (GOAL_HIERARCHY_ID)  ON DELETE CASCADE;\p\g
ALTER TABLE SBI_GOAL_KPI ADD CONSTRAINT FK_SBI_GOAL_KPI_KPI  FOREIGN KEY (KPI_INSTANCE_ID) REFERENCES SBI_KPI_MODEL_INST (KPI_MODEL_INST) ON DELETE CASCADE;\p\g
